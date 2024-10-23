import { validateEnv } from "../utils/validateEnv";
import dotenv from "dotenv";
dotenv.config();
export const sqlConfigOptions = {
  host: '',
  user: '',
  password: '',
  database: '',
  ssl: { rejectUnauthorized: true },
};
