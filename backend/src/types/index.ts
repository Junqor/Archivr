export type TUser = {
  id: number;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  password_hash: string;
  salt: string;
  role: "admin" | "user";
};

// Information in auth token
export type TPayload = {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
};

export type TAuthToken = {
  user: TPayload;
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
  runtime: number;
};

export type TReview = {
  id: number;
  user_id: number;
  media_id: number;
  comment: string | null;
  created_at: string | null;
  rating: number | null;
};

export type TGenre = {
  media_id: number;
  genre: string;
  id: number;
};
