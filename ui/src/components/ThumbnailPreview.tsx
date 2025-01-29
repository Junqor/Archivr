// ThumbnailPreview.tsx

import { useEffect, useState } from "react";
import { TMedia } from "@/types/media";
import { getLikes, getUserRating } from "@/api/media";
import { Link } from "react-router-dom";
import {
  StarRounded,
  FavoriteRounded,
  PersonRounded,
} from "@mui/icons-material";
import { formatInteger } from "@/utils/formatInteger";

function ThumbnailPreview({ media }: { media: TMedia }) {
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
        backgroundImage: `url(${media.thumbnail_url.replace("w500", "w342")})`,
      }}
      className="aspect-2/3 bg-cover bg-center cursor-pointer relative"
    >
      <Link
        to={`/media/${media.id}`}
        className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
      >
        {/* If the media title is too long, truncate it */}
        <h4 className="text-center">
          {" "}
          {media.title.length > 35
            ? media.title.substring(0, 35) + "..."
            : media.title}
        </h4>
        <div className="grid grid-cols-2 gap-1 place-items-center">
          <StarRounded fontSize="medium" />
          <p>{media.rating ? formatInteger(media.rating) : "~"}</p>
          <PersonRounded fontSize="medium" />
          <p>{userRating ? Math.round(userRating * 10) / 10 : "~"}/5</p>
          <FavoriteRounded fontSize="medium" />
          <p>{likes !== null ? likes.toString() : "Loading..."}</p>
        </div>
      </Link>
    </div>
  );
}

export default ThumbnailPreview;
