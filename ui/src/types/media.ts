export type TMedia = {
  id: number;
  title: string;
  description: string;
  release_date: string;
  age_rating: string;
  thumbnail_url: string;
  rating: number;
  genres: string[];
  category: string;
  runtime: number;
};

export type TMediaStats = {
  likes: number;
  userRating: number | null; // average user rating
};
