import { RowDataPacket } from "mysql2";

export type TUser = RowDataPacket & {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  salt: string;
};
