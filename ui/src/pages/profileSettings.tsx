import { Frame } from "lucide-react";


function ProfileSettingsSelect(){
    return (
        <div className="flex flex-col flex-shrink-0 w-[320px]">
        </div>
    )
}

export function ProfileSettings(){
    return (
        <div className="flex items-start rounded-3xl w-[960px] max-w-[960px] h-[733px] bg-black border-white border">
            <ProfileSettingsSelect></ProfileSettingsSelect>
            <line className="bg-white w-[0.5px] h-[733px]"></line>
        </div>
    )
}