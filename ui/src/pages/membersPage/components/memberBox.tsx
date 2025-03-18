import { searchUsers } from "@/api/user";
import { UserAvatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FavoriteRounded, RateReviewRounded } from "@mui/icons-material";
import { MemberKebab } from "./memberKebab";
import { Link } from "react-router-dom";
import { formatInteger } from "@/utils/formatInteger";

export const MemberBox = ({
  user,
}: {
  user: Awaited<ReturnType<typeof searchUsers>>[0];
}) => {
  return (
    <>
      <div className="flex items-center justify-between self-stretch bg-[#1B1B1A] px-3 py-4">
        <div className="flex items-center gap-3">
          <Link to={"/profile/" + user.username}>
            <UserAvatar user={{ ...user, avatar_url: user.avatarUrl }} />
          </Link>
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-end gap-1">
              <h4 className="text-white">
                {user.displayName || user.username}
              </h4>
              {user.pronouns && <p className="text-muted">({user.pronouns})</p>}
            </div>
            <div className="flex items-start gap-2 text-nowrap text-sm text-muted md:gap-3">
              <p>{formatInteger(user.followers)} Followers</p>
              <p>|</p>
              <p>{formatInteger(user.following)} Following</p>
            </div>
          </div>
        </div>
        <div className="inline-flex items-center justify-start gap-2">
          <div className="flex items-start justify-start gap-5 text-muted md:w-60">
            <div className="flex flex-1 items-center justify-start gap-3">
              <RateReviewRounded />
              <div className="min-w-6 justify-start font-['Inter'] text-base font-medium">
                {formatInteger(user.reviews)}
              </div>
            </div>
            <div className="flex flex-1 items-center justify-start gap-3">
              <FavoriteRounded />
              <div className="min-w-6 justify-start font-['Inter'] text-base font-medium">
                {formatInteger(user.likes)}
              </div>
            </div>
          </div>
          <div className="flex h-7 items-center justify-center gap-1">
            <MemberKebab user={user} />
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
};
