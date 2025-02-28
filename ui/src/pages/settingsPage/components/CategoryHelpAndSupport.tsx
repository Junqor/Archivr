import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useRef } from "react";

export function ProfileSettingsCategoryHelpAndSupport(){
    const feedback = useRef<HTMLTextAreaElement>(null);
    
    return (
        <div className="flex self-stretch flex-col gap-2">
            <h4>
                Helpful Links
            </h4>
            <div className="flex items-start gap-3">
                <p className="text-sm font-normal leading-normal underline decoration-solid cursor-pointer transition-colors hover:text-purple">
                    FAQ
                </p>
                <p className="text-sm font-normal leading-normal underline decoration-solid cursor-pointer transition-colors hover:text-purple">
                    Knowledge Base
                </p>
            </div>
            <h3>
                Give us Feedback 
            </h3>
            <line className="self-stretch h-px bg-[#7F7F7E]"></line>
            <Textarea ref={feedback}></Textarea>
            <Button onClick={()=>{if (feedback.current){feedback.current.value = ""}}} className="max-w-[150px]" variant={"destructive"}><Trash2></Trash2> Submit</Button>
        </div>
    )
}