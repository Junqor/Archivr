import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth";
import { useSettings } from "@/context/settings";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import React, { useEffect, useRef } from "react";

type ReplyFormProps = React.HTMLAttributes<HTMLDivElement> & {
  handleSubmit: (text: string) => void;
  handleCancel: () => void;
  replyTo: string;
};
export const ReplyForm = React.forwardRef<HTMLDivElement, ReplyFormProps>(
  ({ handleSubmit, handleCancel, replyTo, className, ...props }, ref) => {
    const { user } = useAuth();
    const { settings } = useSettings();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    if (!user) return null;

    // Force the @ to update when the replyTo prop changes
    useEffect(() => {
      if (textAreaRef.current) {
        textAreaRef.current.value = "@" + replyTo + " ";
        textAreaRef.current.focus();
      }
    }, [replyTo]);

    const handleSubmitReply = () => {
      if (!textAreaRef.current) return;
      const text = textAreaRef.current.value;
      handleSubmit(text);
    };

    return (
      <div
        className={cn(
          className,
          "flex flex-col gap-y-3 rounded-xl border border-white bg-black p-4",
        )}
        {...props}
        ref={ref}
      >
        <div className="flex flex-row items-center gap-x-2 space-y-0">
          <UserAvatar
            user={{ ...user, avatar_url: settings?.avatar_url }}
            size="small"
          />
          <h5 className="transition-colors hover:text-purple">
            {settings?.display_name || user.username}
          </h5>
        </div>
        <Textarea
          defaultValue={"@" + replyTo + " "}
          autoFocus
          onFocus={(e) =>
            e.currentTarget.setSelectionRange(
              e.target.value.length,
              e.target.value.length,
            )
          }
          ref={textAreaRef}
        />
        <div className="flex flex-row items-center justify-start gap-x-4">
          <Button onClick={handleCancel} className="w-fit" variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmitReply} className="w-fit gap-x-2">
            Submit <Send className="size-4" />
          </Button>
        </div>
      </div>
    );
  },
);
