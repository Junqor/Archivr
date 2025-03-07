export type TUser = {
  id: number;
  username: string;
  displayName: string | null;
  email: string;
  role: "admin" | "user";
  avatar_url: string | null;
};
