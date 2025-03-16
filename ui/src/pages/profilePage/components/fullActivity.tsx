import { Link } from "react-router-dom";
import { UserAvatar } from "@/components/ui/avatar";
import { formatDate, formatDateYear } from "@/utils/formatDate";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { ratingToStars, ratingToTextStars } from "@/utils/ratingToStars";
import { FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material";
import { formatInteger } from "@/utils/formatInteger";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface ActivityProps {
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
    title?: string;
    thumbnail_url?: string;
    rating?: number;
    release_date?: string;
    like_count?: number;
    is_liked?: number;
  };
  user: {
    username: string;
    avatar_url: string;
    role?: "admin" | "user";
    display_name?: string;
    rating: number;
  };
  review?: {
    created_at: string;
    review_likes: number;
  };
  followee?: {
    username: string;
    display_name?: string;
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

export default function FullActivity({
  activity,
  isSelf,
}: {
  activity: ActivityProps[];
  isSelf: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-start">
      {activity.map((activityItem) => {
        const { activity: act, media, user, followee, reply } = activityItem;

        return (
          <React.Fragment key={act.id}>
            {act.activityType === "review" && (
              <div className="flex w-full items-start gap-3 px-3 py-4">
                {!isSelf && (
                  <div className="flex items-center">
                    <Link
                      to={`/profile/${user.username}`}
                      className="h-fit w-fit"
                    >
                      <UserAvatar user={user} />
                    </Link>
                  </div>
                )}
                <div className="flex w-full flex-[1_0_0] items-start gap-3">
                  <div className="flex w-2/12 flex-col items-start gap-1">
                    <ThumbnailPreview
                      media={{
                        id: act.targetId,
                        title: media?.title || "",
                        thumbnail_url: media?.thumbnail_url || "",
                        rating: media?.rating || 0,
                      }}
                      className="w-full"
                    />
                    {/*
                    Check if this works for following
                    */}
                    <div className="flex items-center gap-1 text-xl">
                      {user.rating !== null && (
                        <div className="flex items-center">
                          {ratingToStars(user.rating)}
                        </div>
                      )}
                      <FavoriteRounded
                        fontSize="inherit"
                        className={`text-muted ${media?.is_liked === 1 ? "" : "invisible"} scale-75`}
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-[1_0_0] flex-col items-end gap-y-1 self-stretch">
                    <div className="flex-start flex w-full justify-between self-stretch text-muted">
                      <p>
                        {isSelf ? (
                          <span className="font-bold">
                            {user.display_name || user.username}
                          </span>
                        ) : (
                          <Link
                            to={`/profile/${user.username}`}
                            className="font-bold hover:underline"
                          >
                            {user.display_name || user.username}
                          </Link>
                        )}{" "}
                        reviewed
                      </p>
                      <p>{formatDate(act.createdAt, true)}</p>
                    </div>
                    <div className="flex items-end gap-1 self-stretch">
                      <Link
                        to={`/media/${act.targetId}`}
                        className="transition-colors hover:text-purple"
                      >
                        <h3>{media?.title}</h3>
                      </Link>
                      <p className="leading-loose text-muted">
                        {formatDateYear(media?.release_date || "")}
                      </p>
                    </div>
                    <p className="w-full flex-[1_0_0] self-stretch text-ellipsis break-words">
                      {act.content}
                    </p>
                    <div className="flex items-center gap-2">
                      <FavoriteBorderRounded
                        fontSize="inherit"
                        className="text-muted"
                      />
                      <p>
                        {formatInteger(media?.like_count || 0)}
                        {media?.like_count === 1 ? " Like" : " Likes"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {act.activityType === "reply" && (
              <div className="flex w-full items-start gap-3 px-3 py-4">
                {!isSelf && (
                  <div className="flex items-center">
                    <Link
                      to={`/profile/${user.username}`}
                      className="h-fit w-fit"
                    >
                      <UserAvatar user={user} />
                    </Link>
                  </div>
                )}
                <div className="flex w-full flex-[1_0_0] items-start gap-3">
                  <div className="flex w-2/12 flex-col items-start gap-1">
                    <ThumbnailPreview
                      media={{
                        id: act.relatedId,
                        title: media?.title || "",
                        thumbnail_url: media?.thumbnail_url || "",
                        rating: media?.rating || 0,
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="flex w-full flex-[1_0_0] flex-col items-end gap-y-1 self-stretch">
                    <div className="flex-start flex w-full justify-between self-stretch text-muted">
                      <p>
                        {isSelf ? (
                          <span className="font-bold">
                            {user.display_name || user.username}
                          </span>
                        ) : (
                          <Link
                            to={`/profile/${user.username}`}
                            className="font-bold hover:underline"
                          >
                            {user.display_name || user.username}
                          </Link>
                        )}{" "}
                        replied to{" "}
                        <Link
                          to={`/profile/${reply?.username}`}
                          className="font-bold hover:underline"
                        >
                          {reply?.display_name || reply?.username}'s
                        </Link>{" "}
                        review of
                      </p>
                      <p>{formatDate(act.createdAt, true)}</p>
                    </div>
                    <div className="flex items-end gap-1 self-stretch">
                      <Link to={`/media/${act.targetId}`}>
                        <h3 className="transition-colors hover:text-purple">
                          {media?.title}
                        </h3>
                      </Link>
                      <p className="leading-loose text-muted">
                        {formatDateYear(media?.release_date || "")}
                      </p>
                    </div>
                    <p className="w-full flex-[1_0_0] self-stretch text-ellipsis break-words">
                      {act.content}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {act.activityType === "like_review" && (
              <div className="flex w-full items-center gap-3 self-stretch bg-[#1B1B1A] px-3 py-4">
                {!isSelf && (
                  <div className="flex items-center">
                    <Link
                      to={`/profile/${user.username}`}
                      className="h-fit w-fit"
                    >
                      <UserAvatar user={user} />
                    </Link>
                  </div>
                )}
                <div className="flex w-full flex-[1_0_0] items-start justify-between gap-3 self-stretch text-white/75">
                  <p>
                    {isSelf ? (
                      <span className="font-bold">
                        {user.display_name || user.username}
                      </span>
                    ) : (
                      <Link
                        to={`/profile/${user.username}`}
                        className="font-bold hover:underline"
                      >
                        {user.display_name || user.username}
                      </Link>
                    )}{" "}
                    liked{" "}
                    <Link
                      to={`/profile/${reply?.username}`}
                      className="font-bold hover:underline"
                    >
                      {reply?.display_name || reply?.username}'s
                    </Link>{" "}
                    {ratingToTextStars(reply?.rating || 0)} review of{" "}
                    <Link
                      to={`/media/${act.relatedId}`}
                      className="font-bold hover:underline"
                    >
                      {media?.title}
                    </Link>
                  </p>
                  <p>{formatDate(act.createdAt, true)}</p>
                </div>
              </div>
            )}

            {act.activityType === "like_media" && (
              <div className="flex w-full items-center gap-3 self-stretch bg-[#1B1B1A] px-3 py-4">
                {!isSelf && (
                  <div className="flex items-center">
                    <Link
                      to={`/profile/${user.username}`}
                      className="h-fit w-fit"
                    >
                      <UserAvatar user={user} />
                    </Link>
                  </div>
                )}
                <div className="flex w-full flex-[1_0_0] items-start justify-between gap-3 self-stretch text-white/75">
                  <p>
                    {isSelf ? (
                      <span className="font-bold">
                        {user.display_name || user.username}
                      </span>
                    ) : (
                      <Link
                        to={`/profile/${user.username}`}
                        className="font-bold hover:underline"
                      >
                        {user.display_name || user.username}
                      </Link>
                    )}{" "}
                    liked{" "}
                    <Link
                      to={`/media/${act.relatedId}`}
                      className="font-bold hover:underline"
                    >
                      {media?.title}
                    </Link>
                  </p>
                  <p>{formatDate(act.createdAt, true)}</p>
                </div>
              </div>
            )}

            {act.activityType === "follow" && (
              <div className="flex w-full items-center gap-3 self-stretch bg-[#1B1B1A] px-3 py-4">
                {!isSelf && (
                  <div className="flex items-center">
                    <Link
                      to={`/profile/${user.username}`}
                      className="h-fit w-fit"
                    >
                      <UserAvatar user={user} />
                    </Link>
                  </div>
                )}
                <div className="flex w-full flex-[1_0_0] items-start justify-between gap-3 self-stretch text-white/75">
                  <p>
                    {isSelf ? (
                      <span className="font-bold">
                        {user.display_name || user.username}
                      </span>
                    ) : (
                      <Link
                        to={`/profile/${user.username}`}
                        className="font-bold hover:underline"
                      >
                        {user.display_name || user.username}
                      </Link>
                    )}{" "}
                    followed{" "}
                    <Link
                      to={`/profile/${followee?.username}`}
                      className="font-bold hover:underline"
                    >
                      {followee?.display_name || followee?.username}
                    </Link>
                  </p>
                  <p>{formatDate(act.createdAt, true)}</p>
                </div>
              </div>
            )}
            <Separator />
          </React.Fragment>
        );
      })}
    </div>
  );
}
