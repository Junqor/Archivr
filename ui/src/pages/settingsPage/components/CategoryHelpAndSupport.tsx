import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";
import { Label } from "@/components/ui/label";

export function ProfileSettingsCategoryHelpAndSupport() {
  const feedback = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col gap-2 self-stretch">
      <Label>Helpful Links</Label>
      <div className="flex items-start gap-3">
        <p className="cursor-pointer text-sm font-normal leading-normal underline decoration-solid transition-colors hover:text-purple">
          FAQ
        </p>
        <p className="cursor-pointer text-sm font-normal leading-normal underline decoration-solid transition-colors hover:text-purple">
          Knowledge Base
        </p>
      </div>
      <Label>Give us Feedback</Label>
      <Textarea
        ref={feedback}
        className="flex min-h-[67px] items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
        placeholder="Type your feedback here"
        id="feedback"
      ></Textarea>
      <Button
        onClick={() => {
          if (feedback.current) {
            feedback.current.value = "";
          }
        }}
        className="self-center"
      >
        Submit Feedback
      </Button>
    </div>
  );
}
