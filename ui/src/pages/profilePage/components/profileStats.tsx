import { formatInteger } from "@/utils/formatInteger";

interface ProfilePageProps {
  id: number;
  avatarUrl?: string;
  displayName?: string;
  pronouns?: string;
  username: string;
  location?: string;
  bio?: string;
  tiktok?: string;
  youtube?: string;
  instagram?: string;
  follower_count: number;
  following_count: number;
  review_count: number;
}

export default function ProfileStats({
  review_count,
  follower_count,
  following_count,
}: ProfilePageProps) {
  return (
    <div className="ml-auto flex items-center gap-4">
      <div className="flex items-end gap-2 sm:flex-col sm:items-start">
        <h3>{formatInteger(review_count || 0)}</h3>
        <p className="leading-loose text-muted sm:leading-normal">Reviews</p>
      </div>
      <div className="flex items-end gap-2 sm:flex-col sm:items-start">
        <h3>{formatInteger(follower_count || 0)}</h3>
        <p className="leading-loose text-muted sm:leading-normal">Followers</p>
      </div>
      <div className="flex items-end gap-2 sm:flex-col sm:items-start">
        <h3>{formatInteger(following_count || 0)}</h3>
        <p className="leading-loose text-muted sm:leading-normal">Following</p>
      </div>
    </div>
  );
}
