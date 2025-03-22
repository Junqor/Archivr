export type TUser = {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
};

export type TUserOffence = {
  id: number;
  user_id: number;
  action_type: string;
  message: string;
  expiry_date: string | undefined;
  timestamp: string | undefined;
  pardon_timestamp: string | undefined;
}
