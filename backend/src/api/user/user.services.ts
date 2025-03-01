import { conn, db } from "../../db/database.js";
import { RowDataPacket } from "mysql2";
import { Jimp } from "jimp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../configs/s3.js";
import fs from "fs";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { logger } from "../../configs/logger.js";

export async function getUserSettings(user_id: number) {
  const [result] = await conn.query<(RowDataPacket & number)[]>(
    `SELECT * FROM User_Settings WHERE user_id = ?;`,
    [user_id]
  );
  return result[0];
}

export async function getUserProfileSettings(user_id: number) {
  const [result] = await conn.query<(RowDataPacket & number)[]>(
    `SELECT username, display_name, status, bio, pronouns, location, social_instagram, social_youtube, social_tiktok FROM User_Settings INNER JOIN Users ON Users.id = User_Settings.user_id WHERE user_id = ?;`,
    [user_id]
  );
  return result[0];
}

export async function getUserSettingsForSettingsContext(user_id: number) {
  try {
    const [result] = await conn.query<(RowDataPacket & number)[]>(
      "SELECT " +
        "display_name, " +
        "show_adult_content, " +
        "theme, " +
        "font_size, " +
        "grant_personal_data, " +
        "show_personalized_content" +
        " FROM User_Settings WHERE user_id = ?;",
      [user_id]
    );
    return result[0];
  } catch (error) {
    console.error(error);
  }
}

export async function setUserSettings(
  user_id: number,
  values: Map<string, string>
) {
  try {
    let setValues: string = "";
    let insertArray: Array<string> = [];
    values.forEach((value, key, map) => {
      if (setValues != "") {
        setValues = setValues.concat(", ");
      }
      setValues = setValues.concat("`" + key.replaceAll(/`/g, "") + "` = ?");
      insertArray.push(value);
    });
    insertArray.push(user_id.toString());
    if (setValues != "") {
      await conn.query<(RowDataPacket & number)[]>(
        "UPDATE User_Settings SET " + setValues + " WHERE user_id = ?;",
        insertArray
      );
    } else {
      throw new Error(
        `tried to set user settings for user_id ${user_id} but was given no settings to set`
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export async function setPfp(
  user_id: number,
  file: Express.Multer.File | undefined
) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    // load file into jimp
    const image = await Jimp.read(file.path);
    // resize image
    image.resize({ w: 256, h: 256 });
    // save image to jpeg and compress it to hell
    const blob = await image.getBuffer("image/jpeg", { quality: 80.0 });

    fs.unlink(file.path, () => {});

    // send the file all at once
    await s3Client.send(
      new PutObjectCommand({
        Body: blob,
        Bucket: "archivr-pfp",
        Key: "pfp-" + user_id + ".jpeg",
        ContentType: "image/jpeg",
      })
    );

    // Update the user's pfp in the database
    const rows = await db
      .update(users)
      .set({
        avatarUrl: `https://archivr-pfp.sfo3.cdn.digitaloceanspaces.com/pfp-${user_id}.jpeg`,
      })
      .where(eq(users.id, user_id));
    return;
  } catch (error) {
    if (file) fs.unlink(file.path, () => {});
    throw error;
  }
}
