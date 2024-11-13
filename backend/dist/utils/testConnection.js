import { conn } from "../configs/digitalocean.config.js";
export async function testConnection() {
    const [rows] = await conn.query("SELECT * FROM Users WHERE username = 'testuser';");
}
