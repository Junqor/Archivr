import { Link } from "react-router-dom";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDate, formatDateYear } from "@/utils/formatDate";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { ratingToStars, ratingToTextStars } from "@/utils/ratingToStars";
import { FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material";
import { formatInteger } from "@/utils/formatInteger";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { TEnhancedActivity } from "@/api/activity";
import { cn } from "@/lib/utils";

export function ActivityBox({ activity }: { activity: TEnhancedActivity }) {
  return (
    <React.Fragment key={activity.activity.id}>
      {activity.activity.activityType === "review" && (
        <div className="flex w-full items-start gap-3 px-3 py-4">
          <div className="flex items-center">
            <Link
              to={`/profile/${activity.user.username}`}
              className="h-fit w-fit"
            >
              <UserAvatar user={activity.user} className="size-8" />
            </Link>
          </div>
          <div className="flex w-full flex-[1_0_0] items-start gap-3">
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
                <FavoriteRounded
                  fontSize="inherit"
                  className={`text-muted ${activity.media?.is_liked ? "" : "invisible"} scale-75`}
                />
              </div>
            </div>
            <div className="flex w-3/4 flex-[1_0_0] flex-col items-end gap-1 self-stretch sm:w-10/12">
              <div className="flex-start flex w-full justify-between self-stretch text-muted">
                <p>
                  <Link
                    to={`/profile/${activity.user.username}`}
                    className="font-bold hover:underline"
                  >
                    {activity.user.display_name || activity.user.username}
                  </Link>{" "}
                  reviewed
                </p>
                <p>{formatDate(activity.activity.createdAt, true)}</p>
              </div>
              <div className="flex items-end gap-1 self-stretch">
                <Link
                  to={`/media/${activity.activity.targetId}`}
                  className="transition-colors hover:text-purple"
                >
                  <h3>{activity.media?.title}</h3>
                </Link>
                <p className="hidden w-full leading-loose text-muted sm:block">
                  {formatDateYear(activity.media?.release_date || "")}
                </p>
              </div>
              <p className="w-full max-w-72 flex-[1_0_0] self-stretch text-ellipsis break-words sm:max-w-none">
                {activity.activity.content}
              </p>
              <div className="flex items-center gap-2">
                <FavoriteBorderRounded
                  fontSize="inherit"
                  className="text-muted"
                />
                <p>
                  {formatInteger(activity.media?.like_count || 0)}
                  {activity.media?.like_count === 1 ? " Like" : " Likes"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activity.activity.activityType === "reply" && (
        <div className="flex w-full items-start gap-3 px-3 py-4">
          <div className="flex items-center">
            <Link
              to={`/profile/${activity.user.username}`}
              className="h-fit w-fit"
            >
              <UserAvatar user={activity.user} className="size-8" />
            </Link>
          </div>
          <div className="flex w-full flex-[1_0_0] items-start gap-3">
            <div className="flex w-1/4 flex-col items-start gap-1 sm:w-2/12">
              <ThumbnailPreview
                media={{
                  id: activity.activity.relatedId ?? 0,
                  title: activity.media?.title || "",
                  thumbnail_url: activity.media?.thumbnail_url || "",
                  rating: activity.media?.rating || 0,
                  likes: activity.media?.like_count || 0,
                  userRating: activity.media?.userRating || null,
                }}
                className="w-full"
              />
            </div>
            <div className="flex w-full flex-[1_0_0] flex-col items-end gap-y-1 self-stretch">
              <div className="flex-start flex w-full justify-between self-stretch text-muted">
                <p>
                  <Link
                    to={`/profile/${activity.user.username}`}
                    className="font-bold hover:underline"
                  >
                    {activity.user.display_name || activity.user.username}
                  </Link>{" "}
                  replied to{" "}
                  <Link
                    to={`/profile/${activity.reply?.username}`}
                    className="font-bold hover:underline"
                  >
                    {activity.reply?.display_name || activity.reply?.username}
                    's
                  </Link>{" "}
                  review of
                </p>
                <p>{formatDate(activity.activity.createdAt, true)}</p>
              </div>
              <div className="flex items-end gap-1 self-stretch">
                <Link to={`/media/${activity.activity.targetId}`}>
                  <h3 className="transition-colors hover:text-purple">
                    {activity.media?.title}
                  </h3>
                </Link>
                <p className="hidden w-full leading-loose text-muted sm:block">
                  {formatDateYear(activity.media?.release_date || "")}
                </p>
              </div>
              <p className="w-full flex-[1_0_0] self-stretch text-ellipsis break-words">
                {activity.activity.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {activity.activity.activityType === "like_review" && (
        <div className="flex w-full items-center gap-3 self-stretch bg-[#1B1B1A] px-3 py-4">
          <div className="flex items-center">
            <Link
              to={`/profile/${activity.user.username}`}
              className="h-fit w-fit"
            >
              <UserAvatar user={activity.user} className="size-8" />
            </Link>
          </div>
          <div className="flex w-full flex-[1_0_0] items-center justify-between gap-3 self-stretch text-white/75">
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
            <p>{formatDate(activity.activity.createdAt, true)}</p>
          </div>
        </div>
      )}

      {activity.activity.activityType === "like_media" && (
        <div className="flex w-full items-center gap-3 self-stretch bg-[#1B1B1A] px-3 py-4">
          <div className="flex items-center">
            <Link
              to={`/profile/${activity.user.username}`}
              className="h-fit w-fit"
            >
              <UserAvatar user={activity.user} className="size-8" />
            </Link>
          </div>
          <div className="flex w-full flex-[1_0_0] items-center justify-between gap-3 self-stretch text-white/75">
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
            <p>{formatDate(activity.activity.createdAt, true)}</p>
          </div>
        </div>
      )}

      {activity.activity.activityType === "follow" && (
        <div className="flex w-full items-center gap-3 self-stretch bg-[#1B1B1A] px-3 py-4">
          <div className="flex items-center">
            <Link
              to={`/profile/${activity.user.username}`}
              className="h-fit w-fit"
            >
              <UserAvatar user={activity.user} className="size-8" />
            </Link>
          </div>
          <div className="flex w-full flex-[1_0_0] items-center justify-between gap-3 self-stretch text-white/75">
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
            <p>{formatDate(activity.activity.createdAt, true)}</p>
          </div>
        </div>
      )}
      <Separator />
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
          className="outline outline-1 -outline-offset-1 outline-white/10"
        />
      </Link>
    </div>
  );
}
