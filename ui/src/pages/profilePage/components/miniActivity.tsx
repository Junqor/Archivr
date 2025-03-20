import { Link } from "react-router-dom";
import { formatFormalDate } from "@/utils/formatDate";
import { ratingToTextStars } from "@/utils/ratingToStars";

interface activityProps {
  activity: {
    id: number;
    userId: number;
    activityType: string;
    targetId: number;
    relatedId: number;
    content: string;
    createdAt: string;
  };
  media?: {
    title: string;
    thumbnail_url: string;
    rating: number;
    release_date: string;
    like_count: number;
    is_liked: number;
  };
  user: {
    username: string;
    avatar_url: string;
    role: string;
    display_name: string;
    rating: number;
  };
  review?: {
    created_at: string;
    review_likes: number;
  };
  followee?: {
    username: string;
    display_name: string;
    avatar_url: string;
    role: string;
  };
  reply?: {
    user_id: number;
    username: string;
    avatar_url: string;
    role: string;
    display_name: string;
    rating: number;
  };
}

export default function MiniActivity({
  activity,
}: {
  activity: activityProps[];
}) {
  return (
    <div className="flex w-full flex-[1_0_0] flex-col items-start gap-4 self-stretch">
      {activity.map((activity: activityProps) => (
        <p key={activity.activity.id} className="text-muted">
          <span className="font-bold">
            {activity.user.display_name || activity.user.username}
          </span>{" "}
          {(() => {
            switch (activity.activity.activityType) {
              case "follow":
                return (
                  <>
                    followed{" "}
                    <Link
                      to={`/profile/${activity.followee?.username}`}
                      className="font-bold text-white/75 transition-colors hover:text-white"
                    >
                      {activity.followee?.display_name ||
                        activity.followee?.username}
                    </Link>{" "}
                    on {formatFormalDate(activity.activity.createdAt)}
                  </>
                );
              case "like_media":
                return (
                  <>
                    liked{" "}
                    <Link
                      to={`/media/${activity.activity.targetId}`}
                      className="font-bold text-white/75 transition-colors hover:text-white"
                    >
                      {activity.media?.title}
                    </Link>{" "}
                    on {formatFormalDate(activity.activity.createdAt)}
                  </>
                );
              case "review":
                return (
                  <>
                    reviewed{" "}
                    <Link
                      to={`/media/${activity.activity.targetId}`}
                      className="font-bold text-white/75 transition-colors hover:text-white"
                    >
                      {activity.media?.title}
                    </Link>{" "}
                    {ratingToTextStars(activity.user.rating)} on{" "}
                    {formatFormalDate(activity.activity.createdAt)}
                  </>
                );
              case "reply":
                return (
                  <>
                    replied to{" "}
                    <Link
                      to={`/profile/${activity.reply?.username}`}
                      className="font-bold text-white/75 transition-colors hover:text-white"
                    >
                      {activity.reply?.display_name || activity.reply?.username}
                      's
                    </Link>{" "}
                    review on{" "}
                    <Link
                      to={`/media/${activity.activity.targetId}`}
                      className="font-bold text-white/75 transition-colors hover:text-white"
                    >
                      {activity.media?.title}
                    </Link>{" "}
                    {ratingToTextStars(activity.user.rating)} on{" "}
                    {formatFormalDate(activity.activity.createdAt)}
                  </>
                );
              case "like_review":
                return (
                  <>
                    liked{" "}
                    <Link
                      to={`/profile/${activity.reply?.username}`}
                      className="font-bold text-white/75 transition-colors hover:text-white"
                    >
                      {activity.reply?.display_name || activity.reply?.username}
                      's
                    </Link>{" "}
                    review on{" "}
                    <Link
                      to={`/media/${activity.activity.targetId}`}
                      className="font-bold text-white/75 transition-colors hover:text-white"
                    >
                      {activity.media?.title}
                    </Link>{" "}
                    {ratingToTextStars(activity.user.rating)} on{" "}
                    {formatFormalDate(activity.activity.createdAt)}
                  </>
                );
              default:
                return "";
            }
          })()}{" "}
        </p>
      ))}
    </div>
  );
}
