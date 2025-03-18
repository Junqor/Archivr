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

export async function is_user_banned(user_id: number) {
    const current_timestamp = Date.now();
    const res = await conn.query("SELECT expiry_date FROM Moderator_Actions WHERE user_id = ? AND action_type = 'ban' ORDER BY expiry_date DESC LIMIT 1",[user_id]);
    console.log(res);
}

export async function get_user_offences(user_id: number, limit: number, offset: number) {
    limit = Math.max(Math.floor(limit),0);
    offset = Math.max(Math.floor(offset),0);
    const res = await conn.query("SELECT * FROM Moderator_Actions WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?, ?", [user_id,offset,limit]);
    return res;
}