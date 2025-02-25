import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input";
import { Youtube, Instagram, Music2, ImageUp } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

export function ProfileSettingsCategoryProfile({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>(string)}){
    const { user } = useAuth();
    
    const api_url:string = import.meta.env.VITE_API_URL;

    return (
        <div className="flex flex-col self-stretch gap-2">
            <div className="flex items-center gap-5 self-stretch">
                <Dialog>
                    <DialogTrigger asChild>
                        <div style={{backgroundImage:"url(penguin.png)"}} className={"cursor-pointer bg-cover bg-center w-[200px] h-[200px] rounded-[200px] bg-neutral-900"}>
                            <div className="flex items-center justify-center bg-[#44444488] w-[200px] h-[200px] rounded-[200px] opacity-0 hover:opacity-100">
                                <ImageUp className="size-20"></ImageUp>
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogPortal>
                        <DialogOverlay className="bg-[#111111AA] fixed inset-0"/>
                        <DialogContent>
                            <div className="flex flex-col items-center justify-center bg-black fixed border border-white rounded-2xl top-1/2 bottom-1/2 left-1/2 right-1/2 translate-x-[-50%] translate-y-[-50%] max-w-[90%] max-h-[90%] w-[360px] h-[400px] z-50">
                                <DialogTitle>
                                    Set PFP
                                </DialogTitle>
                                <form action={api_url+"/user/set-pfp"} method="POST" encType="multipart/form-data">
                                    <legend>Upload Avatar</legend>
                                    <input type="file" name="pfp" accept="image/png, image/jpeg, image/pjpeg, image/webp"></input>
                                    <button type="submit" className="">Upload</button>
                                </form>
                                <DialogClose>
                                    <Button variant={"outline"}>Cancel</Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </DialogPortal>
                </Dialog>
                <div className="flex flex-col items-start gap-3 flex-1">
                    <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                        <h4>
                            Display Name
                        </h4>
                        <Input maxLength={32} onChange={(event)=>{updateSetting("display_name",event.target.value)}} defaultValue={findSetting("display_name")} placeholder={user?.username} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                        </Input>
                    </div>

                    <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                        <h4 className=" text-[#7F7F7E]">
                            Username
                        </h4>
                        <Input disabled value={"@"+user?.username} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-[#7F7F7E] text-[#7F7F7E] bg-black">
                        </Input>
                    </div>

                    <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                        <h4>
                            Status
                        </h4>
                        <Input maxLength={128} onChange={(event)=>{updateSetting("status",event.target.value)}} defaultValue={findSetting("status")} placeholder="..." className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                        </Input>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                <h4>
                    Bio
                </h4>
                <Textarea maxLength={30000} onChange={(event)=>{updateSetting("bio",event.target.value)}} defaultValue={findSetting("bio")} placeholder="write about yourself..." className="min-h-[67px] flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                </Textarea>
            </div>
            <div className="flex justify-center items-start gap-2 self-stretch">
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <h4>
                        Pronouns
                    </h4>
                    <Input maxLength={32} onChange={(event)=>{updateSetting("pronouns",event.target.value)}} defaultValue={findSetting("pronouns")} placeholder="it/that" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                </div>
                
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <h4>
                        Location
                    </h4>
                    <Input maxLength={32} onChange={(event)=>{updateSetting("location",event.target.value)}} defaultValue={findSetting("location")} placeholder="Earth" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                </div>
            </div>
            <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex items-start gap-3">
                    <Checkbox onCheckedChange={(checked)=>{updateSetting("public",String(Number(checked)))}} checked={Boolean(Number(findSetting("public")))} className="self-center"></Checkbox>
                    <p>
                        Include profile in members section
                    </p>
                </div>
                <div className="flex items-start gap-3">
                    <Checkbox onCheckedChange={(checked)=>{updateSetting("show_adult_content",String(Number(checked)))}} checked={Boolean(Number(findSetting("show_adult_content")))} className="self-center"></Checkbox>
                    <p>
                        Show adult content
                    </p>
                </div>
            </div>
            <h3>
                Socials
            </h3>
            <line className="self-stretch h-px bg-[#7F7F7E]"></line>
            <div className="flex items-start gap-3 self-stretch py-3">
                <div className="flex flex-col gap-[26px] self-stretch py-[5px]">
                    <div className="flex items-center gap-3">
                        <Instagram></Instagram>
                        <h4>
                            Instagram
                        </h4>
                    </div>
                    <div className="flex items-center gap-3">
                        <Youtube></Youtube>
                        <h4>
                            Youtube
                        </h4>
                    </div>
                    <div className="flex items-center gap-3">
                        <Music2></Music2>
                        <h4>
                            Tiktok
                        </h4>
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