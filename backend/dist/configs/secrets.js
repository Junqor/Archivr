import z from "zod";
import dotenv from "dotenv";
dotenv.config();
// Environment variables
const schema = z.object({
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    JWT_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    TMDB_API_KEY: z.string(),
    TVDB_API_KEY: z.string(),
});
//
const envVariables = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    TVDB_API_KEY: process.env.TVDB_API_KEY,
};
const serverConfig = schema.parse(envVariables);
export { serverConfig };
