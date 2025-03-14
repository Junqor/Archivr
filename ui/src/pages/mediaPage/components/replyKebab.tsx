import { followUser } from "@/api/activity";
import { deleteReply, TReplyBlob } from "@/api/reviews";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/auth";
import {
  DeleteOutlineOutlined,
  OutlinedFlag,
  PersonAdd,
} from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";

type ReplyKebabProps = {
  reply: TReplyBlob;
  mediaId: number;
};

export const ReplyKebab = ({ reply, mediaId }: ReplyKebabProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteReply(reply.id),
    onSuccess: async () => {
      toast.success("Review deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: ["media", JSON.stringify(mediaId), "reviews"],
      });
    },
    onError: () => {
      toast.error("Could not delete review");
    },
  });

  return (
    <Popover>
      <PopoverTrigger>
        <EllipsisVertical className="size-5"></EllipsisVertical>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col p-2" align="end">
        {user && user.id === reply.user_id && (
          // ONLY show delete button if the user is the reviewer
          <>
            <Button
              variant="outline"
              className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
              onClick={() => mutate()}
            >
              <DeleteOutlineOutlined className="mr-1" /> Delete Post
            </Button>
            <hr className="my-1 w-10/12 self-center justify-self-center" />
          </>
        )}
        {user && user.id !== reply.user_id && (
          // DO NOT show follow button if the user is the reviewer
          <>
            <Button
              variant="outline"
              className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
              onClick={() => {
                followUser(reply.user_id).then(() =>
                  toast.success("Followed @" + reply.user.username),
                );
              }}
            >
              <PersonAdd className="mr-1" /> {`Follow @${reply.user.username}`}
            </Button>
            <hr className="my-1 w-10/12 self-center justify-self-center" />
          </>
        )}
        <Button
          variant="outline"
          className="justify-start rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
        >
          <OutlinedFlag className="mr-1" /> Report Post
        </Button>
      </PopoverContent>
    </Popover>
  );
};
