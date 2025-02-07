import { conn } from "../db/database.js";
// Search for media by name
export async function searchMedia(query, limit, offset) {
    const [rows] = await conn.query(`SELECT * FROM Media WHERE title LIKE ? ORDER BY rating DESC LIMIT ? OFFSET ?`, [`%${query}%`, limit, (offset - 1) * limit]);
    // Get genres for the media
    const media = await Promise.all(rows.map(async (row) => {
        const genres = await getGenres(row.id);
        return { ...row, genres: genres };
    }));
    return {
        status: "success",
        media: media,
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
    const genres = await getGenres(id);
    const media = { ...rows[0], genres: genres };
    return {
        status: "success",
        media: media,
    };
}
// Helper function for getting a media's genres
async function getGenres(mediaId) {
    const [genreRows] = await conn.query(`SELECT * FROM Media_Genre WHERE media_id = ?`, [mediaId]);
    const genres = genreRows.map((row) => row.genre);
    return genres;
}
