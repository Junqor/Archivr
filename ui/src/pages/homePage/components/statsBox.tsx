import {
  FavoriteRounded,
  QuestionAnswerRounded,
  StarRounded,
} from "@mui/icons-material";
import { getUserStats } from "@/api/media";
import { formatInteger } from "@/utils/formatInteger";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsBoxProps {
  userId: number;
}

export default function StatsBox({ userId }: StatsBoxProps): JSX.Element {
  const { data: stats } = useQuery({
    queryKey: ["stats", userId],
    queryFn: () => getUserStats(userId),
  });

  return (
    <div className="mx-0 grid w-full grid-cols-3 gap-6 md:mx-auto">
      <div className="mx-auto flex w-fit max-w-xs flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <FavoriteRounded sx={{ fontSize: "3rem", color: "#f2f2f0" }} />
        </div>
        <div>
          {stats ? (
            <>
              <h3 className="font-bold">{formatInteger(stats.stats.likes)}</h3>
              <p>{stats.stats.likes != 1 ? "Likes" : "Like"}</p>
            </>
          ) : (
            <StatsSkeleton />
          )}
        </div>
      </div>
      <div className="mx-auto flex w-fit max-w-xs flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <QuestionAnswerRounded sx={{ fontSize: "3rem", color: "#f2f2f0" }} />
        </div>
        <div>
          {stats ? (
            <>
              <h3 className="font-bold">
                {formatInteger(stats.stats.reviews)}
              </h3>
              <p>{stats.stats.reviews != 1 ? "Reviews" : "Review"}</p>
            </>
          ) : (
            <StatsSkeleton />
          )}
        </div>
      </div>
      <div className="mx-auto flex w-fit max-w-xs flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <StarRounded sx={{ fontSize: "3rem", color: "#f2f2f0" }} />
        </div>
        <div>
          {stats ? (
            <>
              <h3 className="font-bold">
                {formatInteger(stats.stats.ratings)}
              </h3>
              <p>{stats.stats.ratings != 1 ? "Ratings" : "Rating"}</p>
            </>
          ) : (
            <StatsSkeleton />
          )}
        </div>
      </div>
    </div>
  );
}

const StatsSkeleton = () => {
  return (
    <>
      <Skeleton className="mt-2 h-8 w-8" />
      <Skeleton className="mt-2 h-4 w-12" />
    </>
  );
};
