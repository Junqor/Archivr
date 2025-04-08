import { UserAvatar } from "@/components/ui/avatar";
import { followUser } from "@/api/activity";
import { toast } from "sonner";
import { ProfileKebab } from "./profileKebab";
import {
  PublicRounded,
  Instagram,
  YouTube,
  MusicNoteRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { TUser } from "@/types/user";

interface ProfileHeroProps {
  user: TUser | null;
  profilePage: {
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
  };
  background?: string;
}

export default function ProfileHero({
  user,
  profilePage,
  background,
}: ProfileHeroProps) {
  return (
    <section
      className={`flex ${background ? "aspect-video" : ""} w-full items-end gap-5 self-stretch p-5 sm:p-10`}
      style={
        background
          ? {
              background: `linear-gradient(0deg, rgba(13, 13, 13, 0.05) 0%, rgba(13, 13, 13, 0.05) 100%), linear-gradient(180deg, rgba(13, 13, 13, 0.00) 50%, rgba(13, 13, 13, 0.50) 65%, #0D0D0D 100%), radial-gradient(50% 50% at 50% 50%, rgba(13, 13, 13, 0.00) 0%, rgba(13, 13, 13, 0.75) 100%), url(${background}) lightgray 50% / cover no-repeat`,
            }
          : undefined
      }
    >
      <div className="flex flex-[1_0_0] flex-col items-center gap-5 sm:flex-row">
        <div className="flex flex-[1_0_0] items-center gap-5 self-stretch">
          <div className="flex flex-col items-center gap-2">
            <UserAvatar
              user={{
                username: profilePage.username,
                avatar_url: profilePage.avatarUrl,
              }}
              className="size-28 border border-white sm:size-[9.375rem]"
            />
          </div>
          <div className="flex flex-[1_0_0] flex-col items-start gap-2 self-stretch">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-end gap-1">
                <h3>{profilePage.displayName || profilePage.username}</h3>
                {profilePage.pronouns && (
                  <p className="leading-loose text-muted">
                    ({profilePage.pronouns})
                  </p>
                )}
                <div className="flex items-center justify-center gap-1 self-stretch">
                  {user && user.username !== profilePage.username ? (
                    <button
                      className="box-border flex items-center justify-center rounded-full bg-purple px-5 py-1 text-white transition-colors hover:bg-purple/75"
                      onClick={() => {
                        followUser(profilePage.id).then(() =>
                          toast.success("Followed @" + profilePage.username),
                        );
                      }}
                    >
                      Follow
                    </button>
                  ) : user ? null : (
                    <button
                      className="box-border flex items-center justify-center rounded-full bg-purple px-5 py-1 text-white transition-colors hover:bg-purple/75"
                      onClick={() => {
                        window.location.href = "/login";
                      }}
                    >
                      Follow
                    </button>
                  )}
                  <ProfileKebab />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-muted">@{profilePage.username}</p>
                {profilePage.location && (
                  <div className="flex items-center gap-1 text-muted">
                    <PublicRounded fontSize="inherit" color="inherit" />
                    <p>{profilePage.location}</p>
                  </div>
                )}
              </div>
            </div>
            {profilePage.bio && (
              <p className="flex-[1_0_0] self-stretch">{profilePage.bio}</p>
            )}
          </div>
        </div>
        <div className="flex w-full items-start justify-between gap-5 self-stretch py-1 sm:w-auto sm:flex-col sm:justify-normal">
          {profilePage.instagram && (
            <div className="flex items-center gap-3 text-[1.2rem] font-medium dark:text-white/75 transition-colors dark:hover:text-white text-black/75 hover:text-purple">
              <Instagram color="inherit" />
              <Link to={profilePage.instagram} target="_blank" rel="noreferrer">
                Instagram
              </Link>
            </div>
          )}
          {profilePage.youtube && (
            <div className="flex items-center gap-3 text-[1.2rem] font-medium dark:text-white/75 transition-colors dark:hover:text-white text-black/75 hover:text-purple">
              <YouTube color="inherit" />
              <Link to={profilePage.youtube} target="_blank" rel="noreferrer">
                YouTube
              </Link>
            </div>
          )}
          {profilePage.tiktok && (
            <div className="flex items-center gap-3 text-[1.2rem] font-medium dark:text-white/75 transition-colors dark:hover:text-white text-black/75 hover:text-purple">
              <MusicNoteRounded color="inherit" />
              <Link to={profilePage.tiktok} target="_blank" rel="noreferrer">
                TikTok
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
