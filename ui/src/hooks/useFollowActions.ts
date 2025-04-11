import { trpc, queryClient } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Actions related to the follow system
 * @param id The id of the user to follow
 * @param username The username of the user to follow
 * @param isActive Whether to activate the query (should be true only if user is signed in)
 */
export const useFollowActions = (
  id: number,
  username: string,
  isActive: boolean,
) => {
  const { data: isFollowing } = useQuery(
    trpc.follows.checkIfFollowing.queryOptions(
      { id: id },
      { enabled: isActive },
    ),
  );

  const { mutate: followUser } = useMutation(
    trpc.follows.follow.mutationOptions({
      onError: (e) => {
        toast.error(e.message);
      },
      onSuccess: () => {
        toast.success("Followed @" + username);
        queryClient.invalidateQueries({
          queryKey: trpc.follows.checkIfFollowing.queryKey(),
        });
      },
    }),
  );

  const { mutate: unfollowUser } = useMutation(
    trpc.follows.unfollow.mutationOptions({
      onError: (e) => {
        toast.error(e.message);
      },
      onSuccess: () => {
        toast.success("Unfollowed @" + username);
        queryClient.invalidateQueries({
          queryKey: trpc.follows.checkIfFollowing.queryKey(),
        });
      },
    }),
  );

  return { isFollowing, followUser, unfollowUser };
};
