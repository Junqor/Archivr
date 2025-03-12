import { conn } from "../../db/database.js";

export async function ban_users(user_ids: Array<number>, expiry_date_timestamp: number, message: string) {
    if (user_ids.length <= 0){
        throw new Error("Recieved 0 user_ids");
    }
    let values:Array<any> = [];
    let insert_values:string = "";
    user_ids.forEach(user_id => {
        insert_values = insert_values + "(?,'ban',?,?)"
        values.push(user_id,message,expiry_date_timestamp)
    });

    const res = await conn.query("INSERT INTO Moderator_Actions (user_id, action_type, message, expiry_date) VALUES "+insert_values,values);
    return res;
}

export async function pardon_users(user_ids: Array<number>) {

}

export async function is_user_banned(user_id: number) {
    const current_timestamp = Date.now();
}

export async function get_user_offences(user_id: number) {

}