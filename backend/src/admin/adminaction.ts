import { conn } from "../configs/digitalocean.config.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export type TAdminAction = {
    action_id: number;
    admin_id: number;
    media_id: number;
    action_type: string;
    action_description: string;
    action_timestamp: Date;
};

//add a new admin action to database
export async function add_admin_action(
    admin_id: number,
    media_id: number,
    action_type: string,
    action_description: string
): Promise<void> {
    await conn.query<ResultSetHeader>(
        `INSERT INTO AdminActions (admin_id, media_id, action_type, action_description) VALUES (?, ?, ?, ?)`,
        [admin_id, media_id, action_type, action_description]
    );
}

//retrieve recent admin actions
export async function get_admin_actions(
    limit: number,
    offset: number
): Promise<TAdminAction[]> {
    const[rows] = await conn.query<(RowDataPacket & TAdminAction)[]>(
        `SELECT * FROM AdminActions ORDER BY action_timestamp DESC LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows;
}

//retrieve admin actions based on admin ID, acition type, or media ID
export async function get_filtered_admin_actions(
    admin_id?: number,
    action_type?: string,
    media_id?: number,
    limit: number = 10,
    offset: number = 0
): Promise<TAdminAction[]>{
    let query = `SELECT * FROM AdminActions WHERE 1=1`;
    const params: (number | string)[] = [];

    if(admin_id){
        query += ` AND admin_id = ?`;
        params.push(admin_id);
    }
    if(action_type){
        query += ` AND action_type = ?`;
        params.push(action_type);
    }
    if(media_id){
        query += ` AND media_id = ?`;
        params.push(media_id);
    }
    query += ` ORDER BY action_timestamp DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await conn.query<(RowDataPacket & TAdminAction)[]>(query, params);
    return rows;
}
