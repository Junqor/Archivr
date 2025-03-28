import { getRecentlyReviewed } from "@/api/media";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { UserAvatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { ratingToStars } from "@/utils/ratingToStars";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { FavoriteRounded } from "@mui/icons-material";

export function RecentlyReviewed() {
  const { data: media } = useQuery({
    queryKey: ["recentlyReviewed"],
    queryFn: () => getRecentlyReviewed(),
  });

  return (
    <section className="grid grid-cols-1 gap-y-5 pt-5 md:grid-cols-2 md:gap-5">
      {media
        ? media.map((item) => (
            <div className="flex flex-col gap-y-5" key={item.review.id}>
              <div className="flex min-h-0 flex-row gap-3" key={item.media.id}>
                <div className="w-1/4">
                  <ThumbnailPreview key={item.media.id} media={item.media} />
                </div>
                <div className="flex w-3/4 min-w-0 flex-col items-start justify-start gap-3">
                  <div className="flex flex-col items-start gap-x-1 gap-y-1 overflow-hidden text-ellipsis text-nowrap font-bold">
                    <Link
                      to={`/profile/${item.user.username}`}
                      className="group inline-flex items-center gap-x-2"
                    >
                      <UserAvatar user={item.user} size="small" />
                      <div>
                        <h4 className="text-ellipsis whitespace-nowrap dark:text-white/80 text-black/80 no-scrollbar group-hover:underline">
                          {item.user.display_name
                            ? item.user.display_name
                            : item.user.username}
                        </h4>
                      </div>
                    </Link>
                    <p className="text-muted">
                      reviewed{" "}
                      <Link
                        to={`/media/${item.media.id}`}
                        className="text-wrap dark:text-white/80 text-black/80 hover:underline"
                      >
                        {item.media.title}
                      </Link>
                    </p>
                    <div className="flex flex-row items-center text-2xl">
                      {ratingToStars(item.review.reviewRating)}
                      {!!item.review.isLiked && (
                        <FavoriteRounded
                          fontSize="inherit"
                          className={`scale-75 text-muted`}
                        />
                      )}
                    </div>
                  </div>
                  {item.review && (
                    <p className="line-clamp-4 overflow-hidden text-ellipsis dark:text-white/80 text-black/80">
                      {item.review.reviewText}
                    </p>
                  )}
                  <p className="dark:text-white/70 text-black/70">
                    {formatDate(item.review.created_at, true)}
                  </p>
                </div>
              </div>
              <Separator className="dark:text-white/80 text-black/80" />
            </div>
          ))
        : [...Array(8)].map(() => (
            <div
              className="flex min-h-0 flex-row gap-3"
              key={crypto.randomUUID()}
            >
              <div className="w-1/4">
                <Skeleton className="relative aspect-2/3 h-full w-full rounded-sm outline outline-1 -outline-offset-1 dark:outline-white/10 outline-black/10" />
              </div>
              <div className="flex w-3/4 flex-col gap-3 py-4">
                <Skeleton className="h-5 w-1/2 rounded-sm" />
                <div className="flex flex-row items-center justify-start gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-4 w-1/2 rounded-sm" />
                </div>
                <Skeleton className="h-4 w-1/2 rounded-sm" />
                <Skeleton className="h-4 w-1/4 rounded-sm" />
              </div>
            </div>
          ))}
    </section>
  );
}
