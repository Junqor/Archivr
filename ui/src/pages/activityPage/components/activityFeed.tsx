import { getPaginatedActivity } from "@/api/activity";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityBox } from "./activityBox";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function ActivityFeed({
  type,
  userId,
}: {
  type: "global" | "following";
  userId?: number;
}) {
  const {
    data: activity,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
    isLoading,
    isError,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["activity", type, userId],
    queryFn: ({ pageParam = 0 }) =>
      getPaginatedActivity(type, 15, pageParam, userId),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPage.length === 0) return undefined;
      else return lastPageParam + 15;
    },
  });

  if (isPending || isLoading)
    return (
      <div className="w-full place-items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  if (isError) throw { status: 500 };

  if (activity.pages.flat().length === 0) return <div>No activity found</div>;

  return (
    <>
      <div className="flex w-full flex-col items-start">
        {activity.pages.flat().map((activityObject) => (
          <React.Fragment key={activityObject.activity.id}>
            <ActivityBox activity={activityObject} />
            <Separator className="bg-muted" />
          </React.Fragment>
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
