import { conn } from "../db/database.js";

export async function testConnection() {
  await conn.query("select 1");
}
