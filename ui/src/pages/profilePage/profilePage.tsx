import { getUserProfile } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import {
  Speech,
  ClockAlert,
  MapPin,
  Youtube,
  Instagram,
  Music2,
  UserPlus,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CollapsedText } from "@/components/ui/collapsed-text";

export function ProfilePage() {
  const { username } = useParams();
  if (!username) return <Navigate to="/404" />;

  const {
    error,
    isPending,
    isLoading,
    data: profile,
  } = useQuery({
    queryKey: ["user_profile", username],
    queryFn: () => getUserProfile(username),
    retry: false,
  });

  const api_url: string = import.meta.env.VITE_API_URL;

  if (isPending || isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (error) {
    throw { status: 404, message: "Profile not found" };
  }

  return (
    <div className="flex min-h-screen min-w-full max-w-full gap-2 rounded-2xl border border-white p-4">
      <div className="flex h-full max-w-[40%] flex-col gap-2 rounded-2xl border border-none bg-gray-secondary p-4">
        {/* profile image */}
        <img
          src={api_url + "/user/pfp/" + profile.id}
          className={"h-full w-[500px] rounded-[500px] bg-neutral-900"}
        ></img>
        <div className="flex flex-col">
          {/* username */}
          <div>
            <h2 className="break-words text-gray-100">
              {profile.displayName || profile.username}
            </h2>
            <h4 className="break-words text-gray-400">@{profile.username}</h4>
          </div>
          <div className="mb-2 mt-4 flex h-px self-stretch bg-gray-100"></div>
          {/* Friend and follow buttons */}
          <div className="gap-2 break-words pt-2 text-gray-100">
            <UserPlus
              fill="#FFFFFF"
              strokeWidth={1}
              className="mr-2 inline-block size-8"
            ></UserPlus>
            <a>0 followers</a>
          </div>

          {/* dividing line for socials */}
          {profile?.status || profile?.pronouns || profile?.location ? (
            <div className="my-4 flex h-px self-stretch bg-gray-100"></div>
          ) : null}
          {/* misc profile data */}
          {profile?.status ? (
            <div className="gap-2 break-words pt-2 text-gray-100">
              <ClockAlert className="mr-2 inline-block size-6"></ClockAlert>
              {profile.status}
            </div>
          ) : null}
          {profile?.pronouns ? (
            <div className="gap-2 break-words pt-2 text-gray-100">
              <Speech className="mr-2 inline-block size-6"></Speech>
              {profile.pronouns}
            </div>
          ) : null}
          {profile?.location ? (
            <div className="gap-2 break-words pt-2 text-gray-100">
              <MapPin className="mr-2 inline-block size-6"></MapPin>
              {profile.location}
            </div>
          ) : null}
          {/* bio */}
          {profile.bio ? (
            <>
              <div className="my-4 flex h-px self-stretch bg-gray-100"></div>
              <CollapsedText
                text={profile?.bio}
                max_length={400}
              ></CollapsedText>
            </>
          ) : null}
          {/* dividing line for socials */}
          {profile.instagram || profile.youtube || profile.tiktok ? (
            <div className="mb-2 mt-4 flex h-px self-stretch bg-gray-100"></div>
          ) : null}
          {/* socials */}
          {profile.instagram ? (
            <div className="gap-2 break-words pt-2 text-gray-100">
              <Instagram className="mr-2 inline-block size-6"></Instagram>
              <a href={"//" + profile.instagram}>Instagram</a>
            </div>
          ) : null}
          {profile.youtube ? (
            <div className="gap-2 break-words pt-2 text-gray-100">
              <Youtube className="mr-2 inline-block size-6"></Youtube>
              <a href={"//" + profile.youtube}>Youtube</a>
            </div>
          ) : null}
          {profile.tiktok ? (
            <div className="gap-2 break-words pt-2 text-gray-100">
              <Music2 className="mr-2 inline-block size-6"></Music2>
              <a href={"//" + profile.tiktok}>TikTok</a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
