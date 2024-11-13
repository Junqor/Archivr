import { conn } from "../configs/digitalocean.config.js";
export async function update_rating(media_id, user_id, new_rating) {
    let [rows] = await conn.query("INSERT INTO Ratings (media_id, user_id, rating) VALUES (?, ?, ?) " +
        "ON DUPLICATE KEY UPDATE rating = ?", [media_id, user_id, new_rating, new_rating]);
    return;
}
export async function get_media_rating(media_id) {
    let [rows] = await conn.query("SELECT AVG(rating) as avg FROM Ratings WHERE media_id=?;", [media_id]);
    if (rows[0].length == 0) {
        throw Error("RATINGS AREN'T REAL");
    }
    return rows[0][0].avg;
}
export async function get_user_rating(media_id, user_id) {
    let [rows] = await conn.query("SELECT rating as rat FROM Ratings WHERE media_id=? AND user_id=?;", [media_id, user_id]);
    if (rows[0].length == 0) {
        throw Error("RATINGS AREN'T REAL");
    }
    return rows[0][0].rat;
}
export async function update_review(media_id, user_id, new_comment) {
    let [rows] = await conn.query("INSERT INTO Reviews (media_id,user_id,comment) VALUES (?,?,?) " +
        "ON DUPLICATE KEY UPDATE comment = ?", [media_id, user_id, new_comment, new_comment]);
    return;
}
export async function get_media_reviews(media_id, amount, offset) {
    let [rows] = await conn.query(`SELECT Users.username, Reviews.comment, Reviews.created_at 
    FROM Reviews 
    INNER JOIN Users ON Reviews.user_id = Users.id 
    WHERE Reviews.media_id = ? 
    ORDER BY Reviews.created_at DESC
    LIMIT ? OFFSET ?;`, [media_id, amount, offset]);
    return rows;
}
export async function get_user_review(media_id, user_id) {
    let [rows] = await conn.query("SELECT * FROM Reviews WHERE media_id=? AND user_id=?;", [media_id, user_id]);
    if (rows[0].length == 0) {
        throw Error("REVIEWS AREN'T REAL");
    }
    return rows[0];
}
// Try inserting the like; if it already exists, delete it instead.
export async function update_likes(media_id, user_id) {
    const [result] = await conn.query(`INSERT IGNORE INTO Likes (media_id, user_id) VALUES (?, ?)`, [media_id, user_id]);
    // Check if a row was inserted; if not, delete it instead.
    if (result.affectedRows === 0) {
        // If the row wasn’t inserted (it already exists), delete it to "toggle" the like.
        await conn.query("DELETE FROM Likes WHERE media_id = ? AND user_id = ?;", [
            media_id,
            user_id,
        ]);
    }
}
export async function is_liked(media_id, user_id) {
    const [rows] = await conn.query("SELECT 1 FROM Likes WHERE media_id = ? AND user_id = ? LIMIT 1;", [media_id, user_id]);
    return rows.length > 0;
}
export async function get_likes(media_id) {
    let [rows] = await conn.query("SELECT COUNT(*) as num FROM Likes WHERE media_id=?;", [media_id]);
    return rows[0].num ?? 0;
}
