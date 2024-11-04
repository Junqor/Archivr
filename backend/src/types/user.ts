import { RowDataPacket } from "mysql2";

export type TUser = RowDataPacket & {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  salt: string;
};

export type TMovie = RowDataPacket & {
  id: number;
  title: string;
  description: string;
  release_date: string;
  age_rating: string;
  thumbnail_url: string;
  rating: number;
  genre: string;
};
