import { db } from "../db/database.js";
import { users as UsersTable } from "../db/schema.js";
import { eq } from "drizzle-orm/expressions";

export async function testConnection() {
  const user = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.username, "testuser"));
}
