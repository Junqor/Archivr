import { Search } from "lucide-react";
import { useState } from "react";

export function ProfileSettings(){
    const setSetting = (key:string, value:string) => {

    }
    const getSetting = () => {}
    const [changedSettings, setChangedSettings] = useState(null);
    const [currentSettings, setCurrentSettings] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState("Profile");
    return (
        <div className="flex items-start rounded-3xl w-[960px] max-w-[960px] h-[733px] bg-black border-white border">
            <ProfileSettingsMenu></ProfileSettingsMenu>
            <line className="bg-white w-[1px] h-[733px]"></line>
            <div className="flex w-[640px] p-5 flex-col items-start gap-3 flex-shrink-0">
                <div className="flex flex-col items-start gap-1 self-stretch">
                    <p className="text-white text-2xl font-light leading-normal">
                        {selectedMenu}
                    </p>
                    <line className="w-[600px] h-px bg-[#7F7F7E]"></line>
                </div>
            </div>
        </div>
    )
}

function ProfileSettingsMenu(){
    return (
        <div className="flex flex-col flex-shrink-0 w-[320px]">
            <div className="flex py-5 px-3 justify-between items-center self-stretch border-b border-white">
                <p className="text-white text-2xl font-light leading-normal">
                    Settings
                </p>
                <Search className="w-[21px] h-[21px]"></Search>
            </div>
            <div className="flex flex-col items-start self-stretch">
                <ProfileSettingsMenuButton category="Profile"></ProfileSettingsMenuButton>
                <line className="w-[320px] h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton category="Account"></ProfileSettingsMenuButton>
                <line className="w-[320px] h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton category="Appearance"></ProfileSettingsMenuButton>
                <line className="w-[320px] h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton category="Activity"></ProfileSettingsMenuButton>
                <line className="w-[320px] h-[1px] bg-[#7F7F7E]"></line>
                <ProfileSettingsMenuButton category="Help & Support"></ProfileSettingsMenuButton>
            </div>
        </div>
    )
}

function ProfileSettingsMenuButton({category}: {category:string}){
    const selectedTemp:Boolean = false;
    return (
        <div className={"flex py-5 px-3 items-center gap-3 self-stretch border-r-8 border-solid " + (selectedTemp ? " border-purple" : " border-[#7F7F7E]")}>
            <p className="text-white text-base font-medium leading-normal">
                {category}
            </p>
        </div>
    )
}