import { supabase } from "../configs/supabase.config";

export async function deleteMedia() {
  try {
    const { data, error } = await supabase
      .from("Media")
      .delete()
      .eq("media_id", "11111111-1111-1111-1111-111111111111");
    if (error) {
      console.error(error);
      throw new Error("Error deleting media:", error);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}
