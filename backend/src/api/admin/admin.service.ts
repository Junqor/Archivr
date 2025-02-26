import { z } from "zod";
import { db } from "../../db/database.js";
import { media, mediaGenre } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { mediaBodySchema } from "./admin.route.js";

export async function insert_media(Media: z.infer<typeof mediaBodySchema>) {
  try {
    const [id] = await db.insert(media).values(Media).$returningId();

    const vals = Media.genres?.map((genre) => {
      return { genre, mediaId: id.id };
    });

    await db.insert(mediaGenre).values(vals);
  } catch (error) {
    console.error(error);
    throw Error("One of your possibly many values was wrong in a way");
  }
}

// dont make it use the id property of media that would be stupid
export async function update_media(
  media_id: number,
  Media: z.infer<typeof mediaBodySchema>
) {
  try {
    await db.update(media).set(Media).where(eq(media.id, media_id));

    await db.delete(mediaGenre).where(eq(mediaGenre.id, media_id));

    const vals = Media.genres?.map((genre) => {
      return { genre, mediaId: media_id };
    });

    await db.insert(mediaGenre).values(vals);
  } catch (error) {
    console.error(error);
    throw Error("One of your possibly many values was wrong in a way");
  }
}

export async function delete_media(media_id: number) {
  try {
    await db.delete(media).where(eq(media.id, media_id));
  } catch (error) {
    console.error(error);
    throw Error("There was a problem.");
  }
}
