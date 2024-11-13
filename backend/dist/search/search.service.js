import { conn } from "../configs/digitalocean.config.js";
// Search for media by name
export async function searchMedia(query) {
    const sql = `SELECT * FROM Media WHERE title LIKE ? LIMIT 3`;
    const [rows] = await conn.query(sql, [
        `%${query}%`,
    ]);
    return {
        status: "success",
        media: rows,
    };
}
// Returns a single media entry by its id
export async function getMediaById(id) {
    const sql = `SELECT * FROM Media WHERE id = ?`;
    const [rows] = await conn.query(sql, [id]);
    if (rows.length === 0) {
        return {
            status: "failed",
            media: null,
            message: "Media not found",
        };
    }
    return {
        status: "success",
        media: rows[0],
    };
}
