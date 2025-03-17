import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CopyAllRounded,
  QrCodeRounded,
  BlockRounded,
  OutlinedFlagRounded,
  MoreVertRounded,
} from "@mui/icons-material";

export function ProfileKebab() {
  return (
    <Popover>
      <PopoverTrigger>
        <MoreVertRounded />
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col" align="end">
        <Button
          variant="outline"
          className="flex justify-start gap-2 rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          <CopyAllRounded />
          Copy Profile Link
        </Button>
        <Button
          variant="outline"
          className="flex justify-start gap-2 rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
        >
          <QrCodeRounded />
          Show QR Code
        </Button>
        <Button
          variant="outline"
          className="flex justify-start gap-2 rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
        >
          <BlockRounded />
          Block This Member
        </Button>
        <Button
          variant="outline"
          className="flex justify-start gap-2 rounded-sm border-none px-2 py-1 hover:bg-opacity-75"
        >
          <OutlinedFlagRounded />
          Report This Member
        </Button>
      </PopoverContent>
    </Popover>
  );
}
