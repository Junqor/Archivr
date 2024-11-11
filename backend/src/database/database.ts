import { conn } from "../configs/digitalocean.config";
import { RowDataPacket } from "mysql2";

export type review = RowDataPacket & {
    id:number;
    user_id:number;
    media_id:number;
    comment:string;
    created_at:Date;
  };

export async function update_rating(media_id:number, user_id:number, new_rating:number){
    let rows = await conn.query("SELECT * FROM Ratings WHERE media_id=? AND user_id=?;",[media_id,user_id]);
    if (rows[0].length == 0){
        await conn.query("INSERT INTO Ratings (media_id,user_id,rating) VALUES (?,?,?);",[media_id,user_id,new_rating])
    }
    else{
        await conn.query("UPDATE Ratings SET rating=? WHERE media_id=? AND user_id=?;",[new_rating,media_id,user_id])
    }
    return;
}

export async function get_media_rating(media_id:number):Promise<number>{
    let rows = await conn.query("SELECT AVG(rating) as avg FROM Ratings WHERE media_id=?;",[media_id]);
    if (rows[0].length == 0){
        throw Error("RATINGS AREN'T REAL");
    }
    return rows[0][0].avg;
}

export async function get_user_rating(media_id:number,user_id:number):Promise<number>{
    let rows = await conn.query("SELECT rating as rat FROM Ratings WHERE media_id=? AND user_id=?;",[media_id,user_id]);
    if (rows[0].length == 0){
        throw Error("RATINGS AREN'T REAL");
    }
    return rows[0][0].rat;
}

export async function update_review(media_id:number,user_id:number,new_comment:string){
    let rows = await conn.query("SELECT * FROM Reviews WHERE media_id=? AND user_id=?;",[media_id,user_id]);
    if (rows[0].length == 0){
        await conn.query("INSERT INTO Reviews (media_id,user_id,comment) VALUES (?,?,?);",[media_id,user_id,new_comment])
    }
    else{
        await conn.query("UPDATE Reviews SET comment=? WHERE media_id=? AND user_id=?;",[new_comment,media_id,user_id])
    }
    return;
}

export async function get_media_reviews(media_id:number,amount:number,offset:number):Promise<review[]>{
    let rows = await conn.query("SELECT * FROM Reviews WHERE media_id=? LIMIT ? OFFSET ?;",[media_id,amount,offset])
    if (rows[0].length == 0){
        throw Error("REVIEWS AREN'T REAL");
    }
    return rows[0];
}

export async function get_user_review(media_id:number,user_id:number):Promise<review>{
    let rows = await conn.query("SELECT * FROM Reviews WHERE media_id=? AND user_id=?;",[media_id,user_id]);
    if (rows[0].length == 0){
        throw Error("REVIEWS AREN'T REAL");
    }
    return rows[0][0];
}

export async function like(media_id:number,user_id:number){
    let rows = await conn.query("SELECT * FROM Likes WHERE media_id=? AND user_id=?;",[media_id,user_id]);
    if (rows[0].length == 0){
        await conn.query("INSERT INTO Likes (media_id,user_id) VALUES (?,?);",[media_id,user_id])
    }
    return;
}

export async function unlike(media_id:number,user_id:number){
    await conn.query("DELETE FROM Likes WHERE media_id=? AND user_id=?;",[media_id,user_id]);
}

export async function is_liked(media_id:number,user_id:number):Promise<boolean>{
    let rows = await conn.query("SELECT * FROM Likes WHERE media_id=? AND user_id=?;",[media_id,user_id]);
    if (rows[0].length == 0){
        return false;
    }
    return true;
}

export async function get_likes(media_id:number):Promise<number>{
    let rows = await conn.query("SELECT COUNT(*) as num FROM Likes WHERE media_id=?;",[media_id]);
    if (rows[0].length == 0){
        return 0;
    }
    return rows[0][0].num;
}
