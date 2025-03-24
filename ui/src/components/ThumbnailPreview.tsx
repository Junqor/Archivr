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
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./ui/loading-spinner";

export type TThumbnailPreview = {
  media: {
    id: number;
    title: string;
    thumbnail_url: string | null;
    rating: number | null;
  };
  className?: string;
};

function ThumbnailPreview({ media, className }: TThumbnailPreview) {
  const [likes, setLikes] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null | undefined>(
    undefined,
  );

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
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-sm bg-cover bg-center outline outline-1 -outline-offset-1 outline-white/10",
        className,
      )}
    >
      <img
        src={`${media.thumbnail_url?.replace(".jpg", "_t.jpg")}`}
        loading="lazy"
        width="340"
        height="500"
      />
      <Link
        to={`/media/${media.id}`}
        className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 hover:opacity-100"
      >
        {/* If the media title is too long, truncate it */}
        <h4 className="line-clamp-3 text-ellipsis text-center">
          {media.title?.length > 35
            ? media.title.substring(0, 35) + "..."
            : media.title}
        </h4>
        <div className="grid grid-cols-2 place-items-center gap-1">
          <SignalCellularAlt fontSize="medium" />
          <p>{media.rating ? formatInteger(media.rating) : "~"}</p>
          <StarRounded fontSize="medium" />
          {userRating !== undefined ? (
            <p>{userRating ? userRating / 2 : "~"}/5</p>
          ) : (
            <LoadingSpinner size="small" />
          )}
          <FavoriteRounded fontSize="medium" />
          {likes !== null ? (
            <p>{likes.toString()}</p>
          ) : (
            <LoadingSpinner size="small" />
          )}
        </div>
      </Link>
    </div>
  );
}

export default ThumbnailPreview;
