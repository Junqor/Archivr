import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getUserSettings, setUserSettings } from "@/api/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProfileSettingsCategoryProfile } from "./components/CategoryProfile";
import { ProfileSettingsCategoryAccount } from "./components/CategoryAccount";
import { ProfileSettingsCategoryAppearance } from "./components/CategoryAppearance";
import { ProfileSettingsCategoryActivity } from "./components/CategoryActivity";
import { ProfileSettingsCategoryHelpAndSupport } from "./components/CategoryHelpAndSupport";
import { useSettings } from "@/context/settings";

export function ProfileSettings(){
    const [changedSettings, setChangedSettings] = useState<Map<string,string>>(new Map<string,string>());

    const [selectedMenu, setSelectedMenu] = useState("Profile");

    const { refetch:refetchUseSettings } = useSettings();

    const { data:currentSettings, refetch:refetchCurrentSettings } = useQuery({
        queryKey: ['settingsCurrentSettings'],
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
            refetchUseSettings();
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

    const findSetting = (key:string) : string => {
        const changedValue = changedSettings.get(key);
        if (changedValue != null) {
            return changedValue;
        }
        const currentValue = currentSettings?.get(key);
        if (currentValue != null) {
            return currentValue;
        }
        return "";
    }

    return (
    <>
        <div className="flex items-start rounded-3xl w-full min-h-[calc(100vh-100px)] bg-black border-white border">
            <ProfileSettingsMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}></ProfileSettingsMenu>
            <div className=" bg-white w-px self-stretch"></div>
            <div className="flex p-5 flex-col items-start gap-1 self-stretch w-[67%]">
                <h3>
                    {selectedMenu}
                </h3>
                <div className="h-px mb-3 bg-[#7F7F7E] self-stretch"></div>
                {selectedMenu=="Profile"?<ProfileSettingsCategoryProfile updateSetting={updateSetting} findSetting={findSetting}></ProfileSettingsCategoryProfile>:null}
                {selectedMenu=="Account"?<ProfileSettingsCategoryAccount ></ProfileSettingsCategoryAccount>:null}
                {selectedMenu=="Appearance"?<ProfileSettingsCategoryAppearance updateSetting={updateSetting} findSetting={findSetting}></ProfileSettingsCategoryAppearance>:null}
                {selectedMenu=="Activity"?<ProfileSettingsCategoryActivity updateSetting={updateSetting} findSetting={findSetting}></ProfileSettingsCategoryActivity>:null}
                {selectedMenu=="Help & Support"?<ProfileSettingsCategoryHelpAndSupport ></ProfileSettingsCategoryHelpAndSupport>:null}
            </div>
        </div>
        {
        changedSettings.size > 0
        ?(
            <div className="flex items-center justify-center fixed bottom-5 p-3 gap-3 bg-black border border-white rounded-2xl">
                <h4 className="flex self-center">
                    {changedSettings.size} {changedSettings.size != 1?"settings have been modified":"setting has been modified"}
                </h4>
                <Button onClick={()=>{applyChangedSettings()}} variant={"default"}>Apply Changes</Button>
            </div>
        ):null}
    </>
    )
}

function ProfileSettingsMenu({selectedMenu, setSelectedMenu}:{selectedMenu:string,setSelectedMenu:(a:string)=>void}){
    return (
        <div className="flex flex-col min-w-[33%] flex-shrink-0">
            <div className="flex py-5 px-3 justify-between items-center self-stretch border-b border-white">
                <h3>
                    Settings
                </h3>
                <Search className="w-[21px] h-[21px]"></Search>
            </div>
            <div className="flex flex-col items-start self-stretch">
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Profile"></ProfileSettingsMenuButton>
                <line className="self-stretch h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Account"></ProfileSettingsMenuButton>
                <line className="self-stretch h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Appearance"></ProfileSettingsMenuButton>
                <line className="self-stretch h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Activity"></ProfileSettingsMenuButton>
                <line className="self-stretch h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} category="Help & Support"></ProfileSettingsMenuButton>
                <line className="self-stretch h-[1px] bg-[#7F7F7E]"></line>
            </div>
        </div>
    )
}

function ProfileSettingsMenuButton({category, selectedMenu, setSelectedMenu}: {category:string,selectedMenu:string,setSelectedMenu:(a:string)=>void}){
    return (
        <div onClick={()=>{setSelectedMenu(category)}} className={"flex py-5 px-3 items-center gap-3 self-stretch border-r-8 border-solid hover:bg-neutral-900 " + (category == selectedMenu ? " border-purple" : " border-[#7F7F7E]")}>
            <h4>
                {category}
            </h4>
        </div>
    )
}
