import { FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material";
import { ratingToStars } from "@/utils/ratingToStars";
import { formatDate, formatDateYear } from "@/utils/formatDate";
import { formatInteger } from "@/utils/formatInteger";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { Separator } from "@/components/ui/separator";

interface reviewProps {
  review: {
    id: number;
    comment: string;
    review_likes: number;
    createdAt: string;
  };
  media: {
    id: number;
    title: string;
    release_date: string;
    thumbnail_url: string;
    rating: number;
    avg_rating: number;
    like_count: number;
  };
  user_rating: number;
  is_liked: number;
}

interface ReviewListProps {
  reviews: reviewProps[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="flex w-full flex-col items-start gap-3 self-stretch">
      {reviews.map((review) => (
        <>
          <div
            key={review.review.id}
            className="flex w-full items-start gap-4 self-stretch"
          >
            <div className="flex flex-col items-start justify-center gap-1">
              <ThumbnailPreview
                media={{
                  id: review.media.id,
                  title: review.media.title,
                  thumbnail_url: review.media.thumbnail_url,
                  rating: review.media.rating,
                }}
                className="w-full"
              />
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {ratingToStars(review.user_rating)}
                </div>
                <span
                  className={`text-sm ${review.is_liked === 1 ? "" : "invisible"}`}
                >
                  <FavoriteRounded fontSize="inherit" className="text-muted" />
                </span>
              </div>
            </div>
            <div className="flex flex-[1_0_0] flex-col items-end gap-1 self-stretch">
              <div className="flex items-center justify-between gap-1 self-stretch">
                <div className="flex items-end gap-1 self-stretch">
                  <h3>{review.media.title}</h3>
                  <p className="leading-loose text-muted">
                    {formatDateYear(review.media.release_date)}
                  </p>
                </div>
                <p className="text-muted">
                  {formatDate(review.review.createdAt, true)}
                </p>
              </div>
              <p className="flex-[1_0_0] self-stretch">
                {review.review.comment}
              </p>
              <div className="flex items-center gap-2">
                <FavoriteBorderRounded
                  fontSize="inherit"
                  className="text-muted"
                />
                <p>{formatInteger(review.review.review_likes)}</p>
              </div>
            </div>
          </div>
          {reviews.indexOf(review) !== reviews.length - 1 && (
            <Separator orientation="horizontal" />
          )}
        </>
      ))}
    </div>
  );
}
