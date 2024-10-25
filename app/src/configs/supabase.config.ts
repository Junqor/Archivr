import { createClient } from "@supabase/supabase-js";
import { validateEnv } from "../utils/validateEnv";
import { Database } from "../types/supabase";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = "https://iytqjhvicbyuhxnoeqot.supabase.co";
const supabaseKey = validateEnv(process.env.SUPABASE_KEY);
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export { supabase };
