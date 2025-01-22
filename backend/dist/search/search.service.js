import { conn } from "../configs/digitalocean.config.js";
// Search for media by name
export async function searchMedia(query, limit, offset) {
    const sql = `SELECT * FROM Media WHERE title LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    const [rows] = await conn.query(sql, [
        `%${query}%`,
        limit,
        (offset - 1) * limit,
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
