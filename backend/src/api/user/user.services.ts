import { conn } from "../../db/database.js";
import { RowDataPacket } from "mysql2";

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
