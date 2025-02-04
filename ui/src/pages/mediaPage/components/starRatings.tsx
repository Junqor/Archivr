import { cn } from "@/lib/utils";
import { StarHalf } from "lucide-react";

export const StarRatings = ({
  i,
  className,
  ...props
}: {
  i: number;
} & React.ComponentProps<"svg">) => {
  return (
    <StarHalf
      className={cn(i % 2 !== 0 && "flip-x", className)}
      width="12px"
      height="24px"
      viewBox="0 0 12 24"
      {...props}
    />
  );
};
