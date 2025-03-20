import { getRecentlyReviewed } from "@/api/media";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { UserAvatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { ratingToStars } from "@/utils/ratingToStars";

export function RecentlyReviewed() {
  const { data: media } = useQuery({
    queryKey: ["recentlyReviewed"],
    queryFn: () => getRecentlyReviewed(),
  });

  return (
    <section className="grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-3">
      {media
        ? media.map((item) => (
            <div className="flex min-h-0 flex-row gap-3" key={item.media.id}>
              <div className="w-1/3">
                <ThumbnailPreview key={item.media.id} media={item.media} />
              </div>
              <div className="flex w-2/3 min-w-0 flex-col gap-3 py-4">
                <h4 className="overflow-hidden text-ellipsis text-nowrap font-bold text-white">
                  {item.media.title}
                </h4>
                <div className="flex flex-row items-center justify-start gap-2">
                  <UserAvatar user={item.user} size="small" />
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-white/80 no-scrollbar">
                    {item.user.display_name
                      ? item.user.display_name
                      : item.user.username}
                  </p>
                  <div className="flex flex-row text-2xl">
                    {ratingToStars(item.review.reviewRating)}
                  </div>
                </div>
                {item.review && (
                  <p className="line-clamp-4 overflow-hidden text-ellipsis text-white/80">
                    {item.review.reviewText}
                  </p>
                )}
                <p className="text-white/70">
                  {formatDate(item.review.created_at, true)}
                </p>
              </div>
            </div>
          ))
        : [...Array(8)].map(() => (
            <div
              className="flex min-h-0 flex-row gap-3"
              key={crypto.randomUUID()}
            >
              <div className="w-1/3">
                <Skeleton className="relative aspect-2/3 h-full w-full rounded-sm outline outline-1 -outline-offset-1 outline-white/10" />
              </div>
              <div className="flex w-2/3 flex-col gap-3 py-4">
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
