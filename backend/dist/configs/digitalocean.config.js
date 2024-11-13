import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { validateEnv } from "../utils/validateEnv.js";
dotenv.config();
const access = {
    host: validateEnv(process.env.DB_HOST),
    user: validateEnv(process.env.DB_USER),
    password: validateEnv(process.env.DB_PASSWORD),
    database: validateEnv(process.env.DB_NAME),
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
const conn = mysql.createPool(access);
export { conn };
