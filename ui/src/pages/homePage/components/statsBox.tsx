import {
  FavoriteRounded,
  QuestionAnswerRounded,
  StarRounded,
} from "@mui/icons-material";
import { getUserStats } from "@/api/media";
import { useEffect, useState } from "react";
import { formatInteger } from "@/utils/formatInteger";

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

  return (
    <div className="mx-0 grid w-full grid-cols-3 gap-6 text-white md:mx-auto">
      <div className="mx-auto flex w-fit max-w-xs flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <FavoriteRounded sx={{ fontSize: "3rem" }} />
        </div>
        <div>
          <h3 className="font-bold">{formatInteger(stats.stats.likes)}</h3>
          <p>{stats.stats.likes != 1 ? "Likes" : "Like"}</p>
        </div>
      </div>
      <div className="mx-auto flex w-fit max-w-xs flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <QuestionAnswerRounded sx={{ fontSize: "3rem" }} />
        </div>
        <div>
          <h3 className="font-bold">{formatInteger(stats.stats.reviews)}</h3>
          <p>{stats.stats.reviews != 1 ? "Reviews" : "Review"}</p>
        </div>
      </div>
      <div className="mx-auto flex w-fit max-w-xs flex-row items-center justify-start gap-4">
        <div className="flex flex-row items-center justify-center rounded-full bg-purple p-4">
          <StarRounded sx={{ fontSize: "3rem" }} />
        </div>
        <div>
          {/* TODO: Change this to actual ratings. Need to separate them in the table */}
          <h3 className="font-bold">{formatInteger(stats.stats.ratings)}</h3>
          <p>{stats.stats.reviews != 1 ? "Ratings" : "Rating"}</p>
        </div>
      </div>
    </div>
  );
}
