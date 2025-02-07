import {
  FavoriteRounded,
  QuestionMarkRounded,
  QuestionAnswerRounded,
} from "@mui/icons-material";
import { getUserStats } from "@/api/media";
import { useEffect, useState } from "react";

interface StatsBoxProps {
  userId: number;
}

export default function StatsBox({ userId }: StatsBoxProps): JSX.Element {
  const [stats, setStats] = useState({
    stats: {
      likes: 0,
      ratings: 0,
      reviews: 0,
    },
  });

  useEffect(() => {
    getUserStats(userId).then((data) => setStats(data));
  }, [userId]);

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  return (
    <div className="mx-0 grid w-full grid-cols-3 gap-6 text-white md:mx-auto">
      <div className="mx-auto flex w-fit max-w-xs flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <FavoriteRounded sx={{ fontSize: "3rem" }} />
        </div>
        <div>
          <h3 className="font-bold">{formatNumber(stats.stats.likes)}</h3>
          <p>{stats.stats.likes != 1 ? "Likes" : "Like"}</p>
        </div>
      </div>
      <div className="mx-auto flex w-fit max-w-xs flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <QuestionAnswerRounded sx={{ fontSize: "3rem" }} />
        </div>
        <div>
          <h3 className="font-bold">{formatNumber(stats.stats.reviews)}</h3>
          <p>{stats.stats.reviews != 1 ? "Reviews" : "Review"}</p>
        </div>
      </div>
      <div className="mx-auto flex w-fit max-w-xs flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <QuestionMarkRounded sx={{ fontSize: "3rem" }} />
        </div>
        <div>
          <h3 className="font-bold">{formatNumber(stats.stats.ratings)}</h3>
          <p>{stats.stats.ratings != 1 ? "???s" : "???"}</p>
        </div>
      </div>
    </div>
  );
}
