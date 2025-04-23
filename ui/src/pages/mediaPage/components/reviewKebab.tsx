import { TReview } from "@/api/reviews";
import { deleteReview } from "@/api/reviews";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/auth";
import { useFollowActions } from "@/hooks/useFollowActions";
import {
  DeleteOutlineOutlined,
  OutlinedFlag,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";

type ReviewKebabProps = {
  review: TReview;
};

export const ReviewKebab = ({ review }: ReviewKebabProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: deleteReviewMutation } = useMutation({
    mutationFn: () => deleteReview(review.id),
    onSuccess: async () => {
      toast.success("Review deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: ["media", JSON.stringify(review.media_id), "reviews"],
      });
    },
    onError: () => {
      toast.error("Could not delete review");
    },
  });

  const { isFollowing, followUser, unfollowUser } = useFollowActions(
    review.user_id,
    review.username,
    user !== null,
  );

  return (
    <Popover>
      <PopoverTrigger>
        <EllipsisVertical className="size-5"></EllipsisVertical>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col p-2" align="end">
        {user && user.id === review.user_id && (
          // ONLY show delete button if the user is the reviewer
          <>
            <Button
              variant="outline"
              className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
              onClick={() => deleteReviewMutation()}
            >
              <DeleteOutlineOutlined className="mr-1" /> Delete Post
            </Button>
            <hr className="my-1 w-10/12 self-center justify-self-center" />
          </>
        )}
        {user &&
          user.id !== review.user_id &&
          (isFollowing ? (
            <>
              <Button
                variant="outline"
                className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
                onClick={() => {
                  unfollowUser({ id: review.user_id });
                }}
              >
                <PersonRemove className="mr-1" />{" "}
                {`Unfollow ${review.username}`}
              </Button>
              <hr className="my-1 w-10/12 self-center justify-self-center" />
            </>
          ) : (
            // DO NOT show follow button if the user is the reviewer
            <>
              <Button
                variant="outline"
                className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
                onClick={() => {
                  followUser({ id: review.user_id });
                }}
              >
                <PersonAdd className="mr-1" /> {`Follow ${review.username}`}
              </Button>
              <hr className="my-1 w-10/12 self-center justify-self-center" />
            </>
          ))}
        <PopoverClose asChild>
          <Button
            variant="outline"
            className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
            onClick={() => {
              toast.info(`Reported ${review.username}'s post`);
            }}
          >
            <OutlinedFlag className="mr-1" /> Report Post
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};
