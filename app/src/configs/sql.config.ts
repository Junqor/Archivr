import { validateEnv } from "../utils/validateEnv";
import dotenv from "dotenv";
dotenv.config();
export const sqlConfigOptions = {
  host:       process.env.SQL_HOST,
  user:       process.env.SQL_USER,
  password:   process.env.SQL_PASSWORD,
  database:   process.env.SQL_DB,
  port:       process.env.SQL_PORT,
  ssl: { rejectUnauthorized: true },
};
