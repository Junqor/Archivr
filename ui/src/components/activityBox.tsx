import { Link } from "react-router-dom";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDate } from "@/utils/formatDate";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { ratingToStars, ratingToTextStars } from "@/utils/ratingToStars";
import { FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material";
import { formatInteger } from "@/utils/formatInteger";
import React from "react";
import { TEnhancedActivity } from "@/api/activity";
import { cn } from "@/lib/utils";

export function ActivityBox({ activity }: { activity: TEnhancedActivity }) {
  return (
    <React.Fragment key={activity.activity.id}>
      {activity.activity.activityType === "review" && (
        <div className="flex w-full items-start gap-3 px-3 py-4">
          <div className="flex w-1/4 flex-col items-start gap-1 sm:w-2/12">
            <ThumbnailPreview
              media={{
                id: activity.activity.targetId,
                title: activity.media?.title || "",
                thumbnail_url: activity.media?.thumbnail_url || "",
                rating: activity.media?.rating || 0,
                likes: activity.media?.like_count || 0,
                userRating: activity.media?.userRating || null,
              }}
              className="w-full"
            />
            <div className="flex items-center gap-1 text-lg sm:text-xl">
              {activity.user.rating !== null && (
                <div className="flex items-center">
                  {activity.user.rating !== undefined &&
                    ratingToStars(activity.user.rating)}
                </div>
              )}
              {activity.media?.is_liked !== null && (
                <FavoriteRounded
                  fontSize="inherit"
                  className="scale-75 text-muted"
                />
              )}
            </div>
          </div>

          <div className="flex w-3/4 min-w-0 flex-grow flex-col items-start gap-2 self-stretch">
            <div className="flex w-full flex-row">
              <Link
                to={`/profile/${activity.user.username}`}
                className="group inline-flex items-center gap-x-2"
              >
                <UserAvatar user={activity.user} size="small" />
                <div>
                  <h4 className="text-ellipsis whitespace-nowrap dark:text-white/80 text-black/80 no-scrollbar group-hover:underline">
                    {activity.user.display_name || activity.user.username}
                  </h4>
                </div>
              </Link>
              <p className="ml-auto self-center text-muted">
                {formatDate(activity.activity.createdAt, true)}
              </p>
            </div>
            <p className="text-wrap font-bold text-muted">
              reviewed{" "}
              <Link
                to={`/media/${activity.activity.targetId}`}
                className="text-wrap dark:text-white/80 text-black/80 hover:underline"
              >
                {activity.media?.title}{" "}
              </Link>
            </p>
            <p className="line-clamp-4 w-full overflow-hidden text-ellipsis break-words text-black/80 dark:text-white/80">
              {activity.activity.content}
            </p>
            <div className="mt-auto flex items-center gap-2 self-end text-muted">
              <FavoriteBorderRounded fontSize="inherit" />
              <p>
                {formatInteger(activity.media?.like_count || 0)}
                {activity.media?.like_count === 1 ? " Like" : " Likes"}
              </p>
            </div>
          </div>
        </div>
      )}

      {activity.activity.activityType === "reply" && (
        <div className="flex w-full items-start gap-3 px-3 py-4">
          <div className="flex w-1/4 flex-col items-start gap-1 sm:w-2/12">
            <ThumbnailPreview
              media={{
                id: activity.activity.relatedId ?? -1,
                title: activity.media?.title || "",
                thumbnail_url: activity.media?.thumbnail_url || "",
                rating: activity.media?.rating || 0,
                likes: activity.media?.like_count || 0,
                userRating: activity.media?.userRating || null,
              }}
              className="w-full"
            />
          </div>
          <div className="flex w-3/4 min-w-0 flex-grow flex-col items-start gap-2 self-stretch">
            <div className="flex w-full flex-row">
              <Link
                to={`/profile/${activity.user.username}`}
                className="group inline-flex items-center gap-x-2"
              >
                <UserAvatar user={activity.user} size="small" />
                <div>
                  <h4 className="text-ellipsis whitespace-nowrap dark:text-white/80 text-black/80 no-scrollbar group-hover:underline">
                    {activity.user.display_name || activity.user.username}
                  </h4>
                </div>
              </Link>
              <p className="ml-auto self-center text-muted">
                {formatDate(activity.activity.createdAt, true)}
              </p>
            </div>
            <p className="text-wrap font-bold text-muted">
              replied to{" "}
              <Link
                to={`/profile/${activity.reply?.username}`}
                className="font-bold dark:text-white/80 text-black/80 hover:underline"
              >
                {activity.reply?.display_name || activity.reply?.username}
                's
              </Link>{" "}
              {ratingToTextStars(activity.reply?.rating || 0)} review of{" "}
              <Link
                to={`/media/${activity.activity.targetId}`}
                className="text-wrap dark:text-white/80 text-black/80 hover:underline"
              >
                {activity.media?.title}{" "}
              </Link>
            </p>
            <p className="w-full flex-[1_0_0] self-stretch text-ellipsis break-words">
              {activity.activity.content}
            </p>
          </div>
        </div>
      )}

      {activity.activity.activityType === "like_review" && (
        <div className="flex w-full items-center gap-3 self-stretch dark:bg-[#1B1B1A] bg-[#E4E4E5] px-3 py-4">
          <div className="flex items-center">
            <Link
              to={`/profile/${activity.user.username}`}
              className="h-fit w-fit"
            >
              <UserAvatar user={activity.user} className="size-8" />
            </Link>
          </div>
          <div className="flex w-full flex-[1_0_0] items-center justify-between gap-3 self-stretch text-black/75 dark:text-white/75">
            <p>
              <Link
                to={`/profile/${activity.user.username}`}
                className="font-bold hover:underline"
              >
                {activity.user.display_name || activity.user.username}
              </Link>{" "}
              liked{" "}
              <Link
                to={`/profile/${activity.reply?.username}`}
                className="font-bold hover:underline"
              >
                {activity.reply?.display_name || activity.reply?.username}'s
              </Link>{" "}
              {ratingToTextStars(activity.reply?.rating || 0)} review of{" "}
              <Link
                to={`/media/${activity.activity.relatedId}`}
                className="font-bold hover:underline"
              >
                {activity.media?.title}
              </Link>
            </p>
            <p className="text-nowrap">
              {formatDate(activity.activity.createdAt, true)}
            </p>
          </div>
        </div>
      )}

      {activity.activity.activityType === "like_media" && (
        <div className="flex w-full items-center gap-3 self-stretch dark:bg-[#1B1B1A] bg-[#E4E4E5] px-3 py-4">
          <div className="flex items-center">
            <Link
              to={`/profile/${activity.user.username}`}
              className="h-fit w-fit"
            >
              <UserAvatar user={activity.user} className="size-8" />
            </Link>
          </div>
          <div className="flex w-full flex-[1_0_0] items-center justify-between gap-3 self-stretch text-black/75 dark:text-white/75">
            <p>
              <Link
                to={`/profile/${activity.user.username}`}
                className="font-bold hover:underline"
              >
                {activity.user.display_name || activity.user.username}
              </Link>{" "}
              liked{" "}
              <Link
                to={`/media/${activity.activity.relatedId}`}
                className="font-bold hover:underline"
              >
                {activity.media?.title}
              </Link>
            </p>
            <p className="text-nowrap">
              {formatDate(activity.activity.createdAt, true)}
            </p>
          </div>
        </div>
      )}

      {activity.activity.activityType === "follow" && (
        <div className="flex w-full items-center gap-3 self-stretch dark:bg-[#1B1B1A] bg-[#E4E4E5] px-3 py-4">
          <div className="flex items-center">
            <Link
              to={`/profile/${activity.user.username}`}
              className="h-fit w-fit"
            >
              <UserAvatar user={activity.user} className="size-8" />
            </Link>
          </div>
          <div className="flex w-full flex-[1_0_0] items-center justify-between gap-3 self-stretch text-black/75 dark:text-white/75">
            <p>
              <Link
                to={`/profile/${activity.user.username}`}
                className="font-bold hover:underline"
              >
                {activity.user.display_name || activity.user.username}
              </Link>{" "}
              followed{" "}
              <Link
                to={`/profile/${activity.followee?.username}`}
                className="font-bold hover:underline"
              >
                {activity.followee?.display_name || activity.followee?.username}
              </Link>
            </p>
            <p className="text-nowrap">
              {formatDate(activity.activity.createdAt, true)}
            </p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export function MediaPoster({
  media,
  className,
}: {
  media: any;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] cursor-pointer overflow-hidden rounded-sm transition-transform ease-in-out hover:scale-105",
        className,
      )}
    >
      <Link to={`/media/${media.id}`}>
        <img
          title={media.title}
          src={`${media.thumbnail_url?.replace(".jpg", "_t.jpg")}`}
          className="outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
        />
      </Link>
    </div>
  );
}
