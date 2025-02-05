import { getRecentlyReviewed } from "@/api/media";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export function RecentlyReviewed() {
  const { data: media } = useQuery({
    queryKey: ["recentlyReviewed"],
    queryFn: () => getRecentlyReviewed(),
  });

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {media
        ? media.map((item) => <ThumbnailPreview key={item.id} media={item} />)
        : [...Array(7)].map((_, i) => (
            <Skeleton
              key={i}
              className="relative aspect-2/3 h-full w-full rounded-sm outline outline-1 -outline-offset-1 outline-white/10"
            />
          ))}
    </div>
  );
}
