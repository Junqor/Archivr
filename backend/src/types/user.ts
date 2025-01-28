export type TUser = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  salt: string;
  role: "admin" | "user";
};

// Information in auth token
export type TAuthToken = {
  user: {
    id: number;
    username: string;
    email: string;
    role: "admin" | "user";
  };
};

// "users.ts" looks inside: "Media"
export type TMedia = {
  id: number;
  category: string;
  title: string;
  description: string;
  release_date: string;
  age_rating: string;
  thumbnail_url: string;
  rating: number;
  genres: string[];
};
