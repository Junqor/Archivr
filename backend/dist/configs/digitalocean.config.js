import mysql from "mysql2/promise";
import { serverConfig } from "./secrets.js";
const access = {
    host: serverConfig.DB_HOST,
    user: serverConfig.DB_USER,
    password: serverConfig.DB_PASSWORD,
    database: serverConfig.DB_NAME,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
const conn = mysql.createPool(access);
export { conn };
