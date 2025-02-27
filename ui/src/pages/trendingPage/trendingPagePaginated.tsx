import { getTrendingPaginated } from "@/api/media";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoadingScreen } from "../loadingScreen";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function TrendingPagePaginated({ type }: { type: "movie" | "tv" }) {
  const {
    data: media,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: ["trending", type],
    queryFn: ({ pageParam }) => getTrendingPaginated(type, pageParam),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, pages) => pages.length,
  });

  if (status === "pending") {
    return <LoadingScreen />;
  } else if (status === "error") {
    throw { status: 500 };
  }

  return (
    <main className="flex h-full w-full flex-col gap-y-5 sm:px-10">
      <div className="flex w-full flex-col items-center justify-center text-center md:items-start">
        <h1 className="font-bold">
          Checkout This Weeks
          <span className="bg-gradient-to-br from-blue-600 to-fuchsia-700 bg-clip-text font-extrabold text-transparent">
            {" "}
            Trending {type === "movie" ? "Movies" : "Shows"}{" "}
          </span>
        </h1>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 md:gap-x-6">
        {media?.pages.flat().map((media) => (
          <div className="flex flex-col gap-y-1">
            <ThumbnailPreview
              key={media.id}
              media={media}
              className="transition-transform duration-300 ease-in-out hover:scale-105"
            />
            <p className="line-clamp-2 text-ellipsis px-1 opacity-80">
              {media.title}
            </p>
          </div>
        ))}
      </div>
      <div className="align-center flex justify-center">
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </main>
  );
}
