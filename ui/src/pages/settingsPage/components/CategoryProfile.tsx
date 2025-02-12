import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input";
import { Youtube, Instagram, Music2 } from "lucide-react";

export function ProfileSettingsCategoryProfile({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>(string)}){
    const { user } = useAuth();
    
    return (
        <div className="flex flex-col self-stretch gap-2">
            <div className="flex items-center gap-5 self-stretch">
                <img src={"penguin.png"} className={"max-w-[200px] max-h-[200px] rounded-[200px] bg-neutral-900"}>

                </img>
                <div className="flex flex-col items-start gap-3 flex-1">
                    <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                        <p className="text-base font-medium leading-normal">
                            Display Name
                        </p>
                        <Input maxLength={32} onChange={(event)=>{updateSetting("display_name",event.target.value)}} defaultValue={findSetting("display_name")} placeholder={user?.username} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                        </Input>
                    </div>

                    <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                        <p className="text-base font-medium leading-normal text-[#7F7F7E]">
                            Username
                        </p>
                        <Input disabled value={"@"+user?.username} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-[#7F7F7E] text-[#7F7F7E] bg-black">
                        </Input>
                    </div>

                    <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                        <p className="text-base font-medium leading-normal">
                            Status
                        </p>
                        <Input maxLength={128} onChange={(event)=>{updateSetting("status",event.target.value)}} defaultValue={findSetting("status")} placeholder="..." className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                        </Input>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                <p className="text-base font-medium leading-normal">
                    Bio
                </p>
                <Textarea maxLength={30000} onChange={(event)=>{updateSetting("bio",event.target.value)}} defaultValue={findSetting("bio")} placeholder="write about yourself..." className="min-h-[67px] flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                </Textarea>
            </div>
            <div className="flex justify-center items-start gap-2 self-stretch">
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <p className="text-base font-medium leading-normal">
                        Pronouns
                    </p>
                    <Input maxLength={32} onChange={(event)=>{updateSetting("pronouns",event.target.value)}} defaultValue={findSetting("pronouns")} placeholder="it/that" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                </div>
                
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <p className="text-base font-medium leading-normal">
                        Location
                    </p>
                    <Input maxLength={32} onChange={(event)=>{updateSetting("location",event.target.value)}} defaultValue={findSetting("location")} placeholder="Earth" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                </div>
            </div>
            <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex items-start gap-3">
                    <Checkbox onCheckedChange={(checked)=>{updateSetting("public",String(Number(checked)))}} checked={Boolean(Number(findSetting("public")))} className="self-center"></Checkbox>
                    <p className="text-base font-medium leading-normal">
                        Include profile in members section
                    </p>
                </div>
                <div className="flex items-start gap-3">
                    <Checkbox onCheckedChange={(checked)=>{updateSetting("show_adult_content",String(Number(checked)))}} checked={Boolean(Number(findSetting("show_adult_content")))} className="self-center"></Checkbox>
                    <p className="text-base font-medium leading-normal">
                        Show adult content
                    </p>
                </div>
            </div>
            <p className="text-white text-2xl font-light leading-normal">
                Socials
            </p>
            <line className="self-stretch h-px bg-[#7F7F7E]"></line>
            <div className="flex items-start gap-3 self-stretch py-3">
                <div className="flex flex-col gap-[26px] self-stretch py-[5px]">
                    <div className="flex items-center gap-3">
                        <Instagram></Instagram>
                        <p className="text-base font-medium leading-normal">
                            Instagram
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Youtube></Youtube>
                        <p className="text-base font-medium leading-normal">
                            Youtube
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Music2></Music2>
                        <p className="text-base font-medium leading-normal">
                            Tiktok
                        </p>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-5">
                    <Input maxLength={255} onChange={(event)=>{updateSetting("social_instagram",event.target.value)}} defaultValue={findSetting("social_instagram")} placeholder="https://www.instagram.com/username/" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                    <Input maxLength={255} onChange={(event)=>{updateSetting("social_youtube",event.target.value)}} defaultValue={findSetting("social_youtube")} placeholder="https://www.youtube.com/username/" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                    <Input maxLength={255} onChange={(event)=>{updateSetting("social_tiktok",event.target.value)}} defaultValue={findSetting("social_tiktok")} placeholder="https://www.tiktok.com/@username/" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                </div>
            </div>
        </div>
    )
}