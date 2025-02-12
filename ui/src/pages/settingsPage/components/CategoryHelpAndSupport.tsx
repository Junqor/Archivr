import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useRef } from "react";

export function ProfileSettingsCategoryHelpAndSupport({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>(string|null)}){
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