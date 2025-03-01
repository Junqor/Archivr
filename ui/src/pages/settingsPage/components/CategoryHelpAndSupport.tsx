import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useRef } from "react";

export function ProfileSettingsCategoryHelpAndSupport() {
  const feedback = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col gap-2 self-stretch">
      <h4>Helpful Links</h4>
      <div className="flex items-start gap-3">
        <p className="cursor-pointer text-sm font-normal leading-normal underline decoration-solid transition-colors hover:text-purple">
          FAQ
        </p>
        <p className="cursor-pointer text-sm font-normal leading-normal underline decoration-solid transition-colors hover:text-purple">
          Knowledge Base
        </p>
      </div>
      <h3>Give us Feedback</h3>
      <hr className="h-px self-stretch bg-[#7F7F7E]"></hr>
      <Textarea ref={feedback}></Textarea>
      <Button
        onClick={() => {
          if (feedback.current) {
            feedback.current.value = "";
          }
        }}
        className="max-w-[150px]"
        variant={"destructive"}
      >
        <Trash2></Trash2> Submit
      </Button>
    </div>
  );
}
