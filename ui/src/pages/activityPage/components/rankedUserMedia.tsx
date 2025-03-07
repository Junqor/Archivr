import { getTopUserMedia } from "@/api/activity";
import { StarBadgeSVG } from "@/components/svg/starBadgeSVG";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { MediaPoster } from "./activityBox";

export function RankedUserMedia() {
  const { data: topUserMedia } = useQuery({
    queryKey: ["activity", "top-user-media"],
    queryFn: () => getTopUserMedia(),
  });

  return topUserMedia ? (
    <div className="flex flex-row items-center gap-x-5 overflow-auto px-10 py-5 md:grid md:grid-cols-2 md:gap-3 md:overflow-hidden md:p-0">
      {topUserMedia.map((media, index) => (
        <div
          key={media.id}
          className="flex w-full flex-col justify-center gap-x-2 md:flex-row"
        >
          <div className="relative flex md:w-full">
            <div className="pointer-events-none absolute left-0 top-0 z-10 flex size-9 items-center justify-center rounded-full font-extrabold leading-[2.25rem] md:size-16 md:leading-[2.75rem]">
              <StarBadgeSVG className="absolute z-10 size-14 fill-primary" />
              <h4 className="absolute z-20 font-bold">#{index + 1}</h4>
            </div>
            <MediaPoster
              media={media}
              className="w-full min-w-28 max-w-28 rounded-lg md:ml-4 md:mt-4 md:min-w-0"
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-row items-center gap-x-5 overflow-auto px-10 py-5 md:grid md:grid-cols-2 md:gap-3 md:overflow-hidden md:p-0">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="aspect-2/3 h-40" />
      ))}
    </div>
  );
}
