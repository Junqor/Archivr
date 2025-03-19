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
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export function QRCodeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose} modal={false}>
      <DialogContent className="fixed bottom-1/2 left-1/2 right-1/2 top-1/2 z-50 flex h-min w-fit translate-x-[-50%] translate-y-[-50%] flex-col items-start gap-5 rounded-xl border border-white bg-black p-6 sm:p-8">
        <DialogTitle className="w-full text-center text-3xl font-light">
          Profile QR Code
        </DialogTitle>
        <QRCodeSVG
          value={window.location.href}
          size={240}
          fgColor="#000000"
          bgColor="#f2f2f0"
          className="rounded-xl bg-[#1B1B1A] p-4"
          level="H"
        />
        <h4 className="text-center">
          Scan this QR code to visit this profile on mobile.
        </h4>
      </DialogContent>
    </Dialog>
  );
}

export function ProfileKebab() {
  const [isQRCodeDialogOpen, setIsQRCodeDialogOpen] = useState(false);
  return (
    <>
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
            onClick={() => setIsQRCodeDialogOpen(true)}
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
      <QRCodeDialog
        open={isQRCodeDialogOpen}
        onClose={() => setIsQRCodeDialogOpen(false)}
      />
    </>
  );
}
