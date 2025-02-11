import { Search, ChevronDown, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown";
import { useAuth } from "@/context/auth";
import { getUserSettings, getUserProfileSettings, setUserSettings } from "@/api/user";
import { useMutation, useQuery } from "@tanstack/react-query";

/*
usernames
email
every other generic stuff
somethin for PFP
*/


export function ProfileSettings(){
    //const [currentSettings, setCurrentSettings] = useState<Map<string,string>|null>(null);
    const [changedSettings, setChangedSettings] = useState<Map<string,string>>(new Map<string,string>());

    const [selectedMenu, setSelectedMenu] = useState("Profile");

    const { data:currentSettings, refetch:refetchCurrentSettings } = useQuery({
        queryKey: ['profileSettingsCurrentSettings'],
        queryFn: async () => {
            const a = await getUserSettings();
            const b = new Map<string,string>();
            for (const [key, value] of Object.entries(a)) {
                b.set(key,String(value));
            }
            const c = new Map<string,string>();
            changedSettings.forEach((value:string,key:string) => {
                if (value != b.get(key)){
                    c.set(key,value);
                }
            })
            setChangedSettings(c);
            return b;
        }
    });

    const { mutate:applyChangedSettings } = useMutation({
        mutationFn: async () => {
            await setUserSettings(changedSettings)
            refetchCurrentSettings();
            setChangedSettings(new Map<string,string>());
        }
    });

    const updateSetting = (key:string, value:string) => {
        const currentValue = currentSettings?.get(key);
        const map:Map<string,string> = new Map<string,string>();
        changedSettings.forEach((old_value:string,old_key:string)=>{
            if (old_key == key) {
                if (value != currentValue){
                    map.set(old_key,value);
                }
            }
            else {
                map.set(old_key,old_value);
            }
        })
        if (!changedSettings.has(key) && (value != currentValue)) {
            map.set(key,value);
        }
        setChangedSettings(map);
    }

    const findSetting = (key:string) => {
        const changedValue = changedSettings.get(key);
        if (changedValue != null) {
            return changedValue;
        }
        const currentValue = currentSettings?.get(key);
        if (currentValue != null) {
            return currentValue;
        }
        return null;
    }

    console.log(currentSettings, changedSettings);

    return (
        <>
        <div className="flex flex-col">
            <div className="flex items-start rounded-3xl w-[960px] max-w-[960px] h-[733px] bg-black border-white border">
                <ProfileSettingsMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}></ProfileSettingsMenu>
                <line className="bg-white w-[1px] h-[733px]"></line>
                <div className="flex w-[640px] p-5 flex-col items-start gap-3">
                    <div className="flex flex-col items-start gap-1 self-stretch">
                        <p className="text-white text-2xl font-light leading-normal">
                            {selectedMenu}
                        </p>
                        <line className="w-[600px] h-px bg-[#7F7F7E]"></line>
                        {selectedMenu=="Profile"?<ProfileSettingsCategoryProfile updateSetting={updateSetting} findSetting={findSetting}></ProfileSettingsCategoryProfile>:null}
                        {selectedMenu=="Account"?<ProfileSettingsCategoryAccount updateSetting={updateSetting} findSetting={findSetting}></ProfileSettingsCategoryAccount>:null}
                        {selectedMenu=="Appearance"?<ProfileSettingsCategoryAppearance updateSetting={updateSetting} findSetting={findSetting}></ProfileSettingsCategoryAppearance>:null}
                        {selectedMenu=="Activity"?<ProfileSettingsCategoryActivity updateSetting={updateSetting} findSetting={findSetting}></ProfileSettingsCategoryActivity>:null}
                        {selectedMenu=="Help & Support"?<ProfileSettingsCategoryHelpAndSupport updateSetting={updateSetting} findSetting={findSetting}></ProfileSettingsCategoryHelpAndSupport>:null}
                    </div>
                </div>
            </div>
        </div>
        {
        changedSettings.size > 0
        ?(
        <>
            <div className="min-h-16"></div>
            <div className="flex items-center justify-center fixed bottom-5 p-3 gap-3 bg-black border border-white rounded-2xl">
                <p className="flex self-center text-base font-normal">
                    {changedSettings.size} {changedSettings.size != 1?"settings have been modified":"setting has been modified"}
                </p>
                <Button onClick={()=>{applyChangedSettings()}} variant={"default"}>Apply Changes</Button>
            </div>
        </>
        ):null}
        </>
    )
}

function ProfileSettingsMenu({selectedMenu, setSelectedMenu}:{selectedMenu:string,setSelectedMenu:(a:string)=>void}){
    return (
        <div className="flex flex-col flex-shrink-0 w-[320px]">
            <div className="flex py-5 px-3 justify-between items-center self-stretch border-b border-white">
                <p className="text-white text-2xl font-light leading-normal">
                    Settings
                </p>
                <Search className="w-[21px] h-[21px]"></Search>
            </div>
            <div className="flex flex-col items-start self-stretch">
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Profile"></ProfileSettingsMenuButton>
                <line className="w-[320px] h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Account"></ProfileSettingsMenuButton>
                <line className="w-[320px] h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Appearance"></ProfileSettingsMenuButton>
                <line className="w-[320px] h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Activity"></ProfileSettingsMenuButton>
                <line className="w-[320px] h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Help & Support"></ProfileSettingsMenuButton>
                <line className="w-[320px] h-[1px] bg-[#7F7F7E]"></line>
            </div>
        </div>
    )
}

function ProfileSettingsMenuButton({category, selectedMenu, setSelectedMenu}: {category:string,selectedMenu:string,setSelectedMenu:(a:string)=>void}){
    return (
        <div onClick={()=>{setSelectedMenu(category)}} className={"flex py-5 px-3 items-center gap-3 self-stretch border-r-8 border-solid hover:bg-neutral-900 " + (category == selectedMenu ? " border-purple" : " border-[#7F7F7E]")}>
            <p className="text-white text-base font-medium leading-normal">
                {category}
            </p>
        </div>
    )
}

function ProfileSettingsCategoryProfile({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>string}){
    const { user } = useAuth();
    
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-5 self-stretch">
                <img src={"penguin.png"} className={"w-[200px] h-[200px] rounded-[200px] bg-neutral-900"}>

                </img>
                <div className="flex flex-col items-start gap-3 flex-1">
                    <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                        <p className="text-base font-medium leading-normal">
                            Display Name
                        </p>
                        <Input onChange={(event)=>{updateSetting("display_name",event.target.value)}} defaultValue={findSetting("display_name")} placeholder={user?.username} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
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
                        <Input onChange={(event)=>{updateSetting("status",event.target.value)}} defaultValue={findSetting("status")} placeholder="..." className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                        </Input>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-start gap-2 self-stretch">
                <p className="text-base font-medium leading-normal">
                    Bio
                </p>
                <Textarea onChange={(event)=>{updateSetting("bio",event.target.value)}} defaultValue={findSetting("bio")} className="resize-none min-h-[67px] flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                </Textarea>
            </div>
            <div className="flex justify-center items-start gap-2 self-stretch">
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <p className="text-base font-medium leading-normal">
                        Pronouns
                    </p>
                    <Input onChange={(event)=>{updateSetting("pronouns",event.target.value)}} defaultValue={findSetting("pronouns")} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                </div>
                
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <p className="text-base font-medium leading-normal">
                        Location
                    </p>
                    <Input onChange={(event)=>{updateSetting("location",event.target.value)}} defaultValue={findSetting("location")} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
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
            <line className="w-[600px] h-px bg-[#7F7F7E]"></line>
            <div className="flex items-start gap-3 self-stretch py-3">
                <div className="flex flex-col gap-[26px] self-stretch py-[5px]">
                    <div className="flex items-center gap-3">
                        <Search></Search>
                        <p className="text-base font-medium leading-normal">
                            Instagram
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Search></Search>
                        <p className="text-base font-medium leading-normal">
                            Youtube
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Search></Search>
                        <p className="text-base font-medium leading-normal">
                            Tiktok
                        </p>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-5">
                    <Input onChange={(event)=>{updateSetting("social_instagram",event.target.value)}} defaultValue={findSetting("social_instagram")} placeholder="https://www.instagram.com/username/" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                    <Input onChange={(event)=>{updateSetting("social_youtube",event.target.value)}} defaultValue={findSetting("social_youtube")} placeholder="https://www.youtube.com/username/" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                    <Input onChange={(event)=>{updateSetting("social_tiktok",event.target.value)}} defaultValue={findSetting("social_tiktok")} placeholder="https://www.tiktok.com/@username/" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                    </Input>
                </div>
            </div>
        </div>
    )
}

function ProfileSettingsCategoryAccount({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>string}){
    const hash = localStorage.getItem("access_token")?.split('.')[1];
    let email:string = "";
    if (hash){
        email = atob(hash);
        email = JSON.parse(email).user.email;
    }
    
    return (
        <div className="flex flex-col gap-2 self-stretch">
            <p className="text-base font-medium leading-normal text-[#7F7F7E]">
                Email
            </p>
            <Input disabled value={email?email:"???"} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-[#7F7F7E] text-[#7F7F7E] bg-black">
            </Input>
            <p className="text-white text-2xl font-light leading-normal">
                Change Password
            </p>
            <line className="w-[600px] h-px bg-[#7F7F7E]"></line>
            <p className="text-base font-medium leading-normal">
                Current Password
            </p>
            <Input type="password" placeholder="Enter current password" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
            </Input>
            <p className="text-base font-medium leading-normal">
                New Password
            </p>
            <Input type="password" placeholder="Enter new password"className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
            </Input>
            <p className="text-base font-medium leading-normal">
                Confirm New Password
            </p>
            <Input type="password" placeholder="Enter new password again" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
            </Input>
            <Button className="max-w-[130px]">Save Changes</Button>
            <p className="text-white text-2xl font-light leading-normal">
                Account Data
            </p>
            <line className="w-[600px] h-px bg-[#7F7F7E]"></line>
            {/*
            Uneeded as all the settings are on the glorious MySQL database
            <div className="flex gap-3">
                <Button variant={"outline"} className="max-w-[130px]">Import Your Data</Button>
                <Button variant={"outline"} className="max-w-[130px]">Export Your Data</Button>
            </div>
            */}
            <p className="underline py-2">
                Disable Account
            </p>
        </div>
    )
}

function ProfileSettingsCategoryAppearance({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>string}){
    return (
        <div className="flex flex-col gap-2 self-stretch flex-1">
            <div className="flex gap-2 items-start self-stretch">
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <p className="text-base font-medium leading-normal">
                        Theme
                    </p>
                    <Dropdown>
                        <DropdownTrigger>
                            <div className="flex py-2 px-4 min-h-9 min-w-[295px] items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                                <p className="capitalize text-base font-medium leading-normal">
                                    {findSetting("theme")}
                                </p>
                                <ChevronDown></ChevronDown>
                            </div>
                        </DropdownTrigger>
                    <DropdownContent>
                        <DropdownItem onSelect={()=>{updateSetting("theme","dark")}}>
                            Dark
                        </DropdownItem>
                        <DropdownItem onSelect={()=>{updateSetting("theme","light")}}>
                            Light
                        </DropdownItem>
                    </DropdownContent>
                    </Dropdown>
                </div>
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <p className="text-base font-medium leading-normal">
                        Font
                    </p>
                    <Dropdown>
                        <DropdownTrigger>
                            <div className="flex py-2 px-4 min-h-9 min-w-[295px] items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                                <p className="capitalize text-base font-medium leading-normal">
                                    {findSetting("font_size")}
                                </p>
                                <ChevronDown></ChevronDown>
                            </div>
                        </DropdownTrigger>
                    <DropdownContent>
                        <DropdownItem onSelect={()=>{updateSetting("font_size","small")}}>
                            Small
                        </DropdownItem>
                        <DropdownItem onSelect={()=>{updateSetting("font_size","normal")}}>
                            Normal
                        </DropdownItem>
                        <DropdownItem onSelect={()=>{updateSetting("font_size","large")}}>
                            Large
                        </DropdownItem>
                    </DropdownContent>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

function ProfileSettingsCategoryActivity({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>string}){
    return (
        <div className="flex flex-col gap-2 self-stretch flex-1">
            <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex items-start gap-3">
                    <Checkbox onCheckedChange={(checked)=>{updateSetting("grant_personal_data",String(Number(checked)))}} checked={Boolean(Number(findSetting("grant_personal_data")))} className="self-center"></Checkbox>
                    <p className="text-base font-medium leading-normal">
                        Allow Archivr employees to see where you live
                    </p>
                </div>
                <div className="flex items-start gap-3">
                    <Checkbox onCheckedChange={(checked)=>{updateSetting("show_personalized_content",String(Number(checked)))}} checked={Boolean(Number(findSetting("show_personalized_content")))} className="self-center"></Checkbox>
                    <p className="text-base font-medium leading-normal">
                        Personalized content
                    </p>
                </div>
            </div>   
        </div>
    )
}

function ProfileSettingsCategoryHelpAndSupport({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>string}){
    const feedback = useRef<HTMLTextAreaElement>(null);
    
    return (
        <div className="flex flex-col gap-2">
            <p className="text-base font-medium leading-normal">
                Helpful Links
            </p>
            <div className="flex items-start gap-3">
                <p className="text-sm font-normal leading-normal underline decoration-solid">
                    FAQ
                </p>
                <p className="text-sm font-normal leading-normal underline decoration-solid">
                    Knowledge Base
                </p>
            </div>
            <p className="text-white text-2xl font-light leading-normal">
                Give us Feedback 
            </p>
            <line className="w-[600px] h-px bg-[#7F7F7E]"></line>
            <Textarea ref={feedback} className="resize-none"></Textarea>
            <Button onClick={()=>{if (feedback.current){feedback.current.value = ""}}} className="max-w-[150px]" variant={"destructive"}><Trash2></Trash2> Submit</Button>
        </div>
    )
}