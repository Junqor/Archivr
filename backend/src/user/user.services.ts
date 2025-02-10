import { conn } from "../configs/digitalocean.config.js";
import { RowDataPacket } from "mysql2";

export async function getUserSettings(user_id:number) {
    try {
        const [result] = await conn.query<(RowDataPacket & number)[]>(
            `SELECT * FROM User_Settings WHERE user_id = ?`,
            [user_id]
        );
        return result[0];
    } catch (error) {
        console.error(error);
    }
}

export async function getUserProfileSettings(user_id:number) {
    try {
        const [result] = await conn.query<(RowDataPacket & number)[]>(
            `SELECT display_name, status, bio, pronouns, location, social_instagram, social_youtube, social_tiktok FROM User_Settings WHERE user_id = ?`,
            [user_id]
        );
        return result[0];
    } catch (error) {
        console.error(error);
    } 
}

export async function setUserSettings(user_id:number, values:Map<string,string>) {
    try {
        let v: string = "";
        values.forEach((value, key, map) => {
            v.concat(key, " = ", value, ", ");
        });
        await conn.query<(RowDataPacket & number)[]>(
            `INSERT INTO User_Settings VALUES ? WHERE user_id = ?`,
            [v,user_id]
        );
    } catch (error) {
        console.error(error);
    }    
}