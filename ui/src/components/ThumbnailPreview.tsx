// ThumbnailPreview.tsx

import { useEffect, useState } from "react";
import { getLikes, getUserRating } from "@/api/media";
import { Link } from "react-router-dom";
import {
  FavoriteRounded,
  SignalCellularAlt,
  StarRounded,
} from "@mui/icons-material";
import { formatInteger } from "@/utils/formatInteger";

export type TThumbnailPreview = {
  id: number;
  title: string;
  thumbnail_url: string;
  rating: number | null;
};

function ThumbnailPreview({ media }: { media: TThumbnailPreview }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    async function fetchLikes() {
      const likes = await getLikes({ mediaId: media.id.toString() });
      setLikes(likes);
    }
    async function fetchUserRating() {
      const userRating = await getUserRating({ mediaId: media.id.toString() });
      setUserRating(userRating);
    }
    fetchLikes();
    fetchUserRating();
  }, [media.id]);

  return (
    <div
      title={media.title}
      style={{
        backgroundImage: `url(${media?.thumbnail_url.replace(
          ".jpg",
          "_t.jpg",
        )})`,
      }}
      className="relative aspect-[2/3] cursor-pointer rounded-sm bg-cover bg-center outline outline-1 -outline-offset-1 outline-white/10"
    >
      <Link
        to={`/media/${media.id}`}
        className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 hover:opacity-100"
      >
        {/* If the media title is too long, truncate it */}
        <h4 className="text-center">
          {" "}
          {media.title.length > 35
            ? media.title.substring(0, 35) + "..."
            : media.title}
        </h4>
        <div className="grid grid-cols-2 place-items-center gap-1">
          <SignalCellularAlt fontSize="medium" />
          <p>{media.rating ? formatInteger(media.rating) : "~"}</p>
          <StarRounded fontSize="medium" />
          <p>{userRating ? userRating / 2 : "~"}/5</p>
          <FavoriteRounded fontSize="medium" />
          <p>{likes !== null ? likes.toString() : "Loading..."}</p>
        </div>
      </Link>
    </div>
  );
}

export default ThumbnailPreview;
