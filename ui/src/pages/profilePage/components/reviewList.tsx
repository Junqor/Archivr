import { FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material";
import { ratingToStars } from "@/utils/ratingToStars";
import { formatDate, formatDateYear } from "@/utils/formatDate";
import { formatInteger } from "@/utils/formatInteger";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { Separator } from "@/components/ui/separator";
import React from "react";

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
    <div className="flex w-full flex-col items-start gap-3 self-stretch px-3 py-4">
      {reviews.map((review) => (
        <React.Fragment key={review.review.id}>
          <div
            key={review.review.id}
            className="flex w-full items-start gap-4 self-stretch"
          >
            <div className="flex w-1/4 flex-col items-start gap-1 sm:w-2/12">
              <ThumbnailPreview
                media={{
                  id: review.media.id,
                  title: review.media.title,
                  thumbnail_url: review.media.thumbnail_url,
                  rating: review.media.rating,
                  likes: review.media.like_count,
                  userRating: review.media.avg_rating,
                }}
                className="w-full"
              />
              <div className="flex items-center gap-1 text-[1.1rem] sm:text-xl">
                {review.user_rating !== null && (
                  <div className="flex items-center">
                    {ratingToStars(review.user_rating)}
                  </div>
                )}
                <FavoriteRounded
                  fontSize="inherit"
                  className={`text-muted ${review.is_liked === 1 ? "" : "invisible"} scale-75`}
                />
              </div>
            </div>
            <div className="flex w-3/4 flex-[1_0_0] flex-col items-end gap-1 self-stretch sm:w-10/12">
              <div className="flex w-full items-center justify-between gap-1 self-stretch">
                <div className="flex items-end gap-1 self-stretch">
                  <h3>{review.media.title}</h3>
                  <p className="hidden leading-loose text-muted sm:block">
                    {formatDateYear(review.media.release_date)}
                  </p>
                </div>
                <p className="text-muted">
                  {formatDate(review.review.createdAt, true)}
                </p>
              </div>
              <p className="w-full flex-[1_0_0] self-stretch text-ellipsis break-words">
                {review.review.comment}
              </p>
              <div className="flex items-center gap-2">
                <FavoriteBorderRounded
                  fontSize="inherit"
                  className="text-muted"
                />
                <p>
                  {formatInteger(review.review.review_likes)}
                  {review.review.review_likes === 1 ? " Like" : " Likes"}
                </p>
              </div>
            </div>
          </div>
          {reviews.indexOf(review) !== reviews.length - 1 && (
            <Separator orientation="horizontal" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
