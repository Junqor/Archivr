import { validateEnv } from "../utils/validateEnv";

export const sqlConfigOptions = {
  host: validateEnv(process.env.SQL_HOST),
  user: validateEnv(process.env.SQL_USER),
  password: validateEnv(process.env.SQL_PASSWORD),
  database: validateEnv(process.env.SQL_DATABASE),
  ssl: { rejectUnauthorized: true },
};
