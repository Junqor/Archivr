import {
  MoreVertRounded,
  CopyAllRounded,
  BlockRounded,
  OutlinedFlagRounded,
} from "@mui/icons-material";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { searchUsers } from "@/api/user";
import { PopoverClose } from "@radix-ui/react-popover";
import { toast } from "sonner";

export const MemberKebab = ({
  user,
}: {
  user: Awaited<ReturnType<typeof searchUsers>>[0];
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <MoreVertRounded />
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col" align="end">
        <PopoverClose asChild>
          <Button
            variant="outline"
            className="flex justify-start gap-2 rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.hostname + "/profile/" + user.username,
              );
              toast.success("Copied to clipboard");
            }}
          >
            <CopyAllRounded />
            Copy Profile Link
          </Button>
        </PopoverClose>
        <PopoverClose asChild>
          <Button
            variant="outline"
            className="flex justify-start gap-2 rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
          >
            <BlockRounded />
            Block This Member
          </Button>
        </PopoverClose>
        <PopoverClose asChild>
          <Button
            variant="outline"
            className="flex justify-start gap-2 rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
          >
            <OutlinedFlagRounded />
            Report This Member
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};
