import { TEnhancedActivity } from "@/api/activity";
import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import { MessageSquareQuote } from "lucide-react";
import { Link } from "react-router-dom";

export function ActivityBox({ item }: { item: TEnhancedActivity }) {
  const { activity, media, user, review, followee } = item;
  switch (activity.activityType) {
    case "review":
      return (
        <div className="flex w-full flex-row justify-start gap-x-4 px-3 py-4">
          <Link to={`/profile/${user.username}`} className="h-fit w-fit">
            <UserAvatar user={user} />
          </Link>
          <MediaPoster media={media} className="w-20" />
          <div className="flex w-full flex-col gap-y-1">
            <div className="text-muted flex flex-row">
              <h5>
                <strong>{user.display_name || user.username}</strong> reviewed
              </h5>
              <p className="ml-auto">{formatDate(activity.createdAt, true)}</p>
            </div>
            <Link to={`/media/${media.id}`}>
              <h4 className="font-semibold leading-tight transition-colors hover:text-primary">
                {media.title}
              </h4>
            </Link>
            <div className="flex flex-row gap-x-2">
              <MessageSquareQuote className="mt-1 size-4 min-h-4 min-w-4" />
              <p className="align-center line-clamp-4 overflow-hidden text-ellipsis italic text-white/80">
                {review.reviewText}
              </p>
            </div>
          </div>
        </div>
      );
    case "reply":
      return (
        <div className="flex w-full flex-row justify-start gap-x-4 px-3 py-4">
          <Link to={`/profile/${user.username}`} className="h-fit w-fit">
            <UserAvatar user={user} />
          </Link>
          <MediaPoster media={media} className="w-20" />
          <div className="flex w-full flex-col gap-y-1">
            <div className="text-muted flex flex-row">
              <h5>
                <strong>{user.display_name || user.username}</strong> commented
                on{" "}
                <strong>{followee.display_name || followee.username}'s</strong>{" "}
                review of
              </h5>
              <p className="ml-auto">{formatDate(activity.createdAt, true)}</p>
            </div>
            <Link to={`/media/${media.id}`}>
              <h4 className="font-semibold leading-tight transition-colors hover:text-primary">
                {media.title}
              </h4>
            </Link>
            <div className="flex flex-row gap-x-2">
              <p className="align-center line-clamp-4 overflow-hidden text-ellipsis italic text-white/80">
                {activity.content}
              </p>
            </div>
          </div>
        </div>
      );
    case "like_review":
      return (
        <div className="flex w-full flex-row justify-start gap-x-4 px-3 py-4">
          <Link to={`/profile/${user.username}`} className="h-fit w-fit">
            <UserAvatar user={user} />
          </Link>
          <MediaPoster media={media} className="w-20" />
          <div className="flex w-full flex-col gap-y-1">
            <div className="text-muted flex flex-row">
              <h5>
                <strong>{user.display_name || user.username}</strong> liked{" "}
                <strong>{followee.display_name || followee.username}'s</strong>{" "}
                review of
              </h5>
              <p className="ml-auto">{formatDate(activity.createdAt, true)}</p>
            </div>
            <Link to={`/media/${media.id}`}>
              <h4 className="font-semibold leading-tight transition-colors hover:text-primary">
                {media.title}
              </h4>
            </Link>
            <div className="flex flex-row gap-x-2">
              <UserAvatar user={followee} size="small" />
              <p className="align-center line-clamp-4 overflow-hidden text-ellipsis italic text-white/80">
                {review.reviewText}
              </p>
            </div>
          </div>
        </div>
      );
    case "like_media":
      return (
        <div className="flex flex-row gap-x-2 bg-[#1B1B1A] px-3 py-4 text-[rgba(242,_242,_240,_0.75)]">
          <Link to={`/profile/${user.username}`}>
            <UserAvatar user={user} size="small" />{" "}
          </Link>
          <p>
            <strong>{user.display_name || user.username}</strong> liked{" "}
            <Link
              to={`/media/${media.id}`}
              className="text-white transition-colors hover:text-purple"
            >
              <strong>{media.title}</strong>
            </Link>
          </p>
          <p className="ml-auto">{formatDate(activity.createdAt, true)}</p>
        </div>
      );
    case "follow":
      return (
        <div className="flex flex-row gap-x-2 bg-[#1B1B1A] px-3 py-4 text-[rgba(242,_242,_240,_0.75)]">
          <Link to={`/profile/${user.username}`}>
            <UserAvatar user={user} size="small" />{" "}
          </Link>
          <p>
            <strong>{user.display_name || user.username}</strong> followed{" "}
            <Link
              to={`/profile/${followee.username}`}
              className="transition-colors hover:text-purple"
            >
              <strong>{followee.display_name || followee.username}</strong>
            </Link>
          </p>
          <p className="ml-auto">{formatDate(activity.createdAt, true)}</p>
        </div>
      );
    default:
      return <div>Unknown activity type</div>;
  }
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
