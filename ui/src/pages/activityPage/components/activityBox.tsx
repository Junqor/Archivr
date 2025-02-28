import { TEnhancedActivity } from "@/api/activity";
import { UserAvatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router-dom";

export function ActivityBox({ item }: { item: TEnhancedActivity }) {
  const { activity, user } = item;
  return (
    <div className="flex min-h-20 w-full flex-col gap-y-2 rounded-xl border border-white/30 bg-slate-800 p-4">
      <div className="flex w-full flex-row items-center gap-x-2 pb-2">
        <UserAvatar user={user} size="small" />
        <h4 className="max-w-40 overflow-hidden text-ellipsis text-nowrap text-white">
          {user.username}
        </h4>
        <p className="ml-auto text-white/80">
          {formatDate(activity.createdAt)}
        </p>
      </div>
      <div className="text-white/80">
        <ActivitySwitch item={item} />
      </div>
    </div>
  );
}

// TODO: Replace usernames with link to associated member page
function ActivitySwitch({ item }: { item: TEnhancedActivity }) {
  const { activity, media, user, review, followee } = item;
  switch (activity.activityType) {
    case "follow":
      return (
        <div className="flex flex-row gap-x-2">
          <span className="text-white">{user.username}</span> followed
          <UserAvatar user={followee} size="small" className="inline-flex" />
          <span className="text-white">{followee.username}</span>
        </div>
      );
    case "review":
      return (
        <div className="flex flex-row gap-x-4">
          <MediaPoster media={media} className="w-20" />
          <div className="flex flex-col">
            <h5 className="font-bold">Reviewed {media.title}</h5>
            <p className="line-clamp-4 overflow-hidden text-ellipsis text-white/80">
              {review.reviewText}
            </p>
          </div>
        </div>
      );
    case "like_review":
      return (
        <div className="flex flex-row gap-x-4">
          {media && <MediaPoster media={media} className="w-20" />}
          <div className="flex flex-col gap-y-2">
            <h5 className="font-bold">{user.username} Liked a Review:</h5>
            <Link to={`/media/${review.mediaId}`}>
              <p>{review.reviewText}</p>
            </Link>
          </div>
        </div>
      );
    case "like_media":
      return (
        <div className="flex flex-row gap-x-4">
          <MediaPoster media={media} className="w-20" />
          {user.username} Liked {media.title}
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
    <Link to={`/media/${media.id}`}>
      <div
        title={media.title}
        style={{
          backgroundImage: `url(${media.thumbnail_url?.replace(
            ".jpg",
            "_t.jpg",
          )})`,
        }}
        className={cn(
          "relative aspect-[2/3] cursor-pointer rounded-sm bg-cover bg-center outline outline-1 -outline-offset-1 outline-white/10 transition-transform ease-in-out hover:scale-105",
          className,
        )}
      />
    </Link>
  );
}
