import { conn } from "../../db/database.js";

export async function ban_users(user_ids: Array<number>, expiry_date_timestamp: string|null, message: string) {
    if (user_ids.length <= 0){
        throw new Error("Recieved 0 user_ids");
    }
    let values:Array<any> = [];
    let insert_values:string = "";
    user_ids.forEach(user_id => {
        insert_values = insert_values + "(?,'ban',?,?),"
        values.push(user_id,message,expiry_date_timestamp || null)
    });
    insert_values = insert_values.substring(0,insert_values.length-1);

    const res = await conn.query("INSERT INTO Moderator_Actions (user_id, action_type, message, expiry_date) VALUES "+insert_values,values);
    return res;
}

export async function pardon_users(user_ids: Array<number>) {
    if (user_ids.length <= 0){
        throw new Error("Recieved 0 user_ids");
    }
    let insert_values:string = "";
    user_ids.forEach(user_id => {
        insert_values = insert_values + "?,"
    });
    insert_values = insert_values.substring(0,insert_values.length-1);

    const res = await conn.query("UPDATE Moderator_Actions SET pardon_timestamp = CURRENT_TIMESTAMP WHERE user_id IN ("+insert_values+") AND pardon_timestamp IS NULL",user_ids);
    return res;
}

export async function pardon_action(id:number) {
    const res = await conn.query("UPDATE Moderator_Actions SET pardon_timestamp = CURRENT_TIMESTAMP WHERE id = ? AND pardon_timestamp IS NULL",[id]);
    return res;
}

export async function is_user_banned(user_id: number) {
    const current_timestamp = new Date();
    // find the single unpardoned ban for user_id that expires the farthest in the future
    let res = await conn.query<any[]>("SELECT expiry_date, message FROM Moderator_Actions WHERE user_id = ? AND action_type = 'ban' AND pardon_timestamp IS NULL ORDER BY expiry_date IS NULL DESC, expiry_date DESC LIMIT 1",[user_id]);
    if (res[0].length <= 0) {
        // no date found = FREE
        return {is_banned: false, message: null, expiry_date: null};
    }
    else if (res[0][0].expiry_date == null){
        // found date is an indefinite time = BANNED
        return {is_banned: true, message: res[0][0].message, expiry_date: res[0][0].expiry_date};
    }
    else {
        const date = new Date(Date.parse(res[0][0].expiry_date));
        if (isNaN(date.getTime())) {
            // found date is f***** up = BANNED
            return {is_banned: true, message: res[0][0].message, expiry_date: res[0][0].expiry_date};
        }
        if (date <= current_timestamp) {
            // found date is in the past = FREE
            return {is_banned: false, message: res[0][0].message, expiry_date: res[0][0].expiry_date};
        }
        else {
            // found date is in the future = BANNED
            return {is_banned: true, message: res[0][0].message, expiry_date: res[0][0].expiry_date};
        }
    }
}

export async function get_user_offences(user_id: number, limit: number, offset: number) {
    limit = Math.max(Math.floor(limit),0);
    offset = Math.max(Math.floor(offset),0);
    const res = await conn.query("SELECT * FROM Moderator_Actions WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?, ?", [user_id,offset,limit]);
    return res;
}