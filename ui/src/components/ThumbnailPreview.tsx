// ThumbnailPreview.tsx
import { Link } from "react-router-dom";
import {
  FavoriteRounded,
  SignalCellularAlt,
  StarRounded,
} from "@mui/icons-material";
import { formatInteger } from "@/utils/formatInteger";
import { cn } from "@/lib/utils";

export type TThumbnailPreview = {
  media: {
    id: number;
    title: string;
    thumbnail_url: string | null;
    rating: number | null;
    likes: number;
    userRating: number | null;
  };
  className?: string;
};

function ThumbnailPreview({ media, className }: TThumbnailPreview) {
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
          <p>{media.rating ? formatInteger(media.rating) : "-"}</p>
          <StarRounded fontSize="medium" />
          <p>
            {media.userRating
              ? Math.round((media.userRating / 2) * 10) / 10
              : "-"}
            /5
          </p>
          <FavoriteRounded fontSize="medium" />
          {media.likes.toString()}
        </div>
      </Link>
    </div>
  );
}

export default ThumbnailPreview;
