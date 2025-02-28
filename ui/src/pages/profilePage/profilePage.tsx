import { getUserProfileSettings } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Speech, ClockAlert, MapPin, Youtube, Instagram, Music2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";


export function ProfilePage() {
    const { id } = useParams();
    const {error, isPending, data:profileData} = useQuery({
        queryKey: ['user_profile', id],
        queryFn: async () => {
            if (id)
                return await getUserProfileSettings(Number(id));
        },
    })
    
    const api_url:string = import.meta.env.VITE_API_URL;

    if (isPending){
        return (
            <LoadingSpinner></LoadingSpinner>
        )
    }

    if (error){
        throw new Error("Profile not found");
    }

    return (
        <div className="flex border border-white rounded-2xl p-4 gap-2 max-w-full min-w-full min-h-screen">
            <div className="flex flex-col border max-w-[40%] bg-gray-secondary border-none rounded-2xl p-4 gap-2 h-full">
                {/* profile image */}
                <img src={api_url+"/user/pfp/"+id} className={"rounded-[500px] w-[500px] h-full bg-neutral-900"}></img>
                <div className="flex flex-col">
                    {/* username */}
                    <div>
                        <h2 className="text-gray-100 break-words">
                            {profileData?.display_name ? profileData.display_name : profileData?.username}
                        </h2>
                        <h4 className="text-gray-400 break-words">
                            @{profileData?.username}
                        </h4>
                    </div>
                    {/* misc profile data */}
                    {profileData?.status ? (
                        <div className="gap-2 pt-2 break-words text-gray-100">
                            <ClockAlert className="inline-block size-6 mr-2"></ClockAlert>
                            {profileData.status}
                        </div>
                    ) : null}
                    {profileData?.pronouns ? (
                        <div className="gap-2 pt-2 break-words text-gray-100">
                            <Speech className="inline-block size-6 mr-2"></Speech>
                            {profileData.pronouns}
                        </div>
                    ) : null}
                    {profileData?.location ? (
                        <div className="gap-2 pt-2 break-words text-gray-100">
                            <MapPin className="inline-block size-6 mr-2"></MapPin>
                            {profileData.location}
                        </div>
                    ) : null}
                    {/* bio */}
                    {
                    profileData?.bio
                    ?
                    (<>
                        <div className="flex self-stretch my-4 h-px bg-gray-100 "></div>
                        <p className="text-gray-200 break-words whitespace-pre-wrap">
                            {profileData?.bio}
                        </p>
                    </>)
                    :
                    null
                    }
                    {/* dividing line for socials */}
                    {
                    profileData?.social_instagram || profileData?.social_youtube || profileData?.social_tiktok
                    ?
                    (<div className="flex self-stretch mt-4 mb-2 h-px bg-gray-100 "></div>)
                    :
                    null
                    }
                    {/* socials */}
                    {profileData?.social_instagram ? (
                        <div className="gap-2 pt-2 break-words text-gray-100">
                            <Instagram className="inline-block size-6 mr-2"></Instagram>
                            <a href={"//"+profileData.social_instagram}>Instagram</a>
                        </div>
                    ) : null}
                    {profileData?.social_youtube ? (
                        <div className="gap-2 pt-2 break-words text-gray-100">
                            <Youtube className="inline-block size-6 mr-2"></Youtube>
                            <a href={"//"+profileData.social_youtube}>Youtube</a>
                        </div>
                    ) : null}
                    {profileData?.social_tiktok ? (
                        <div className="gap-2 pt-2 break-words text-gray-100">
                            <Music2 className="inline-block size-6 mr-2"></Music2>
                            <a href={"//"+profileData.social_tiktok}>TikTok</a>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}