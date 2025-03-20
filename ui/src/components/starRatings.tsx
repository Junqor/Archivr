import { StarBorderRounded, StarRounded } from "@mui/icons-material";
import Rating, { RatingProps } from "@mui/material/Rating";

export const StarRatings = ({ ...props }: {} & RatingProps) => {
  return (
    <Rating
      precision={0.5}
      max={5}
      icon={<StarRounded className="text-gray-200" />}
      emptyIcon={<StarBorderRounded className="text-gray-200" />}
      {...props}
    />
  );
};
