import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogPortal, DialogContent, DialogTitle  } from "@/components/ui/dialog";
import { Methbreaker } from "@/games/methbreaker/Methbreaker";

export function PlayMethbreaker(){
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-[#0088FF]">Play Methbreaker</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
            <DialogTitle>
                Methbreaker
            </DialogTitle>
            <Methbreaker/>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}