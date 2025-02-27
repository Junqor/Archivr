import { getPaginatedActivity } from "@/api/activity";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityBox } from "./activityBox";
import { LoadingScreen } from "@/pages/loadingScreen";

export function ActivityFeed({ type }: { type: "global" | "following" }) {
  const {
    data: activity,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
    isLoading,
    isError,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["activity", type],
    queryFn: ({ pageParam }) => getPaginatedActivity(type, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.length === 0) return undefined;
      else return lastPageParam + 1;
    },
  });

  if (isPending || isLoading) return <LoadingScreen />;
  if (isError) throw { status: 500 };

  if (activity.pages.flat().length === 0) return <div>No activity found</div>;

  return (
    <>
      <div className="flex flex-col gap-y-5">
        {activity.pages.flat().map((activityObject) => (
          <ActivityBox key={activityObject.activity.id} item={activityObject} />
        ))}
      </div>
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </>
  );
}
