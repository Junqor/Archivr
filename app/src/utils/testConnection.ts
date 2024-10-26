import { conn } from "../configs/digitalocean.config";

export async function testConnection() {
  const [rows] = await conn.query(
    "SELECT * FROM Users WHERE username = 'testuser';"
  );
}
