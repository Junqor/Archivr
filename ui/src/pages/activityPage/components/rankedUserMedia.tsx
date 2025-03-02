import { getTopUserMedia } from "@/api/activity";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export function RankedUserMedia() {
  const { data: topUserMedia } = useQuery({
    queryKey: ["activity", "top-user-media"],
    queryFn: () => getTopUserMedia(),
  });

  return topUserMedia ? (
    <>
      <h4 className="mb-2 pt-3 text-center font-extrabold">
        Most Loved By Users
      </h4>
      <div className="flex flex-row items-center gap-x-5 overflow-auto p-2 md:flex-col md:gap-y-5">
        {topUserMedia.map((media, index) => (
          <div
            key={media.id}
            className="flex w-full flex-col justify-center gap-x-2 md:flex-row"
          >
            <div className="relative flex md:w-1/2">
              <div className="absolute -left-2 -top-2 z-10 size-9 rounded-full bg-purple/90 text-center text-xl font-extrabold leading-[2.25rem] md:size-11 md:leading-[2.75rem]">
                <p>#{index + 1}</p>
              </div>
              <ThumbnailPreview
                media={media}
                className="w-28 rounded-lg md:w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <>
      <Skeleton className="mb-2 h-8 w-full" />
      <div className="flex flex-row items-center justify-center gap-x-2 gap-y-2 md:flex-col">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-1/2" />
        ))}
      </div>
    </>
  );
}
