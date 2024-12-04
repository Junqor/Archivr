import {
  FavoriteRounded,
  StarRounded,
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
    <div className="grid grid-cols-3 w-full gap-6 text-white sm:mx-auto mx-0">
      <div className="flex flex-row items-center justify-start gap-4 max-w-xs w-fit">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <FavoriteRounded sx={{ fontSize: "3rem" }} />
        </div>
        <div>
          <h3 className="font-bold">{formatNumber(stats.stats.likes)}</h3>
          <p>Likes</p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-4 max-w-xs w-fit">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <StarRounded sx={{ fontSize: "3rem" }} />
        </div>
        <div>
          <h3 className="font-bold">{formatNumber(stats.stats.ratings)}</h3>
          <p>Ratings</p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-4 max-w-xs w-fit">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <QuestionAnswerRounded sx={{ fontSize: "3rem" }} />
        </div>
        <div>
          <h3 className="font-bold">{formatNumber(stats.stats.reviews)}</h3>
          <p>Reviews</p>
        </div>
      </div>
    </div>
  );
}
