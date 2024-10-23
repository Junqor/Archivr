import { supabase } from "../configs/supabase.config";

export async function addMedia() {
  try {
    const { data, error } = await supabase.from("Media").insert({
      category: "movie",
      title: "test",
      media_id: "11111111-1111-1111-1111-111111111111",
    });
    if (error) {
      console.error(error);
      throw new Error("Error adding media:", error);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}
