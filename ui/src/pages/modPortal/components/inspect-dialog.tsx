import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { TUser } from "@/types/user";

export function InspectDialog({ children, user } : { children: React.ReactNode, user: TUser }) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <>
            <DialogHeader>
              <DialogTitle>Peering into the annals of {user.username}</DialogTitle>
              Crimes committed:
            </DialogHeader>
          </>
        </DialogContent>
      </Dialog>
    );
  }