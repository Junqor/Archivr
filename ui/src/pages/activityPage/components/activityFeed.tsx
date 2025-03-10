import { getPaginatedActivity } from "@/api/activity";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityBox } from "./activityBox";
import { LoadingScreen } from "@/pages/loadingScreen";
import { Separator } from "@/components/ui/separator";

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
      <div className="flex w-full flex-col">
        {activity.pages.flat().map((activityObject) => (
          <>
            <ActivityBox
              key={activityObject.activity.id}
              item={activityObject}
            />
            <Separator className="bg-muted" />
          </>
        ))}
      </div>
      {hasNextPage ? (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="align-self-center w-fit"
        >
          {isFetchingNextPage ? "Loading more..." : "Show More"}
        </Button>
      ) : (
        <h4 className="text-center text-white/75">All Caught Up!</h4>
      )}
    </>
  );
}
