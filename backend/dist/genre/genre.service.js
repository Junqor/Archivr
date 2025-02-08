import { conn } from "../db/database.js";
import { slugify } from "../utils/slugify.js";
// Get 5 most popular media of a certain genre
export async function get_popular_media_genre(genre) {
    let [rows] = await conn.query(`SELECT * FROM Media WHERE id IN (
      SELECT media_id FROM Media_Genre WHERE genre = ?)
      ORDER BY rating DESC LIMIT 5;`, [genre]);
    for (let media of rows) {
        let [genres] = await conn.query(`SELECT genre FROM Media_Genre WHERE media_id = ?`, [media.id]);
        media.genres = genres.map((row) => row.genre);
    }
    return rows;
}
// Get 20 medias of a certain genre with offset
export async function get_media_genre(genre, offset, sortBy, order) {
    let orderByClause;
    switch (sortBy) {
        case "alphabetical":
            orderByClause = "title";
            break;
        case "release_date":
            orderByClause = "release_date";
            break;
        case "rating":
            orderByClause = "rating";
            break;
        default:
            orderByClause = "title";
    }
    let [rows] = await conn.query(`SELECT * FROM Media WHERE id IN (
            SELECT media_id FROM Media_Genre WHERE genre = ?)
            ORDER BY ${orderByClause} ${order.toUpperCase()} LIMIT 30 OFFSET ?;`, [genre, offset]);
    return rows;
}
// Get a list of distinct genres
export async function get_genres() {
    let [rows] = await conn.query(`SELECT DISTINCT genre FROM Media_Genre;`);
    return rows.map((row) => ({
        genre: row.genre,
        slug: slugify(row.genre),
    }));
}
