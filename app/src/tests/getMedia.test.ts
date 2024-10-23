import { supabase } from "../configs/supabase.config";

export async function getMedia() {
  try {
    const { data, error } = await supabase.from("Media").select("*");
    if (error) {
      throw new Error("Error fetching media:", error);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}
