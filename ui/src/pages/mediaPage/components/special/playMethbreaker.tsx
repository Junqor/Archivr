import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function PlayMethbreaker() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-[#0088FF]">Play Methbreaker</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="flex h-[500px] w-full flex-col">
          <DialogTitle>Methbreaker</DialogTitle>
          <iframe
            src="/games/methbreaker/index.html"
            className="h-full w-full"
          />
          <p>
            ← →: Move
            <br />
            ↑: Bump/Shoot
            <br />
            Shift: Fast Move
          </p>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
