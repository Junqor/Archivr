import mysql from "mysql2/promise";
import { PoolOptions } from "mysql2";
import { serverConfig } from "../configs/secrets.js";
import { drizzle } from "drizzle-orm/mysql2";

const access: PoolOptions = {
  host: serverConfig.DB_HOST,
  user: serverConfig.DB_USER,
  password: serverConfig.DB_PASSWORD,
  database: serverConfig.DB_NAME,
  timezone: "Z",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const conn = mysql.createPool(access);

const db = drizzle({ client: conn });

export { conn, db };
