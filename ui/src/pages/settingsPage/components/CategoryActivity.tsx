import { Checkbox } from "@/components/ui/checkbox"

export function ProfileSettingsCategoryActivity({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>(string)}){
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