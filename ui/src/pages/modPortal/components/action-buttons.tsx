import { Button } from "@/components/ui/button";
import { TUser } from "@/types/user";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Gavel, Bird, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRef } from "react";
import { ban_users, pardon_users } from "@/api/moderation";

interface ActionButtonsProps {
  selectedItems: Map<number,TUser>;
  pageNumber: number;
  numResults: number;
}

export function ActionButtons({
  selectedItems,
  pageNumber,
  numResults,
}: ActionButtonsProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const handlePageUp = () => {
    searchParams.set("page", `${pageNumber + 1}`);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handlePageDown = () => {
    searchParams.set("page", `${pageNumber - 1}`);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="flex w-full space-x-2">
      <BanGroupDialog selectedItems={selectedItems}>
        <Button
          title="Ban"
          variant="outline"
          size="icon"
          disabled={selectedItems.size === 0}
          className="border-red-500 hover:bg-red-500 hover:bg-opacity-50"
        >
          <Gavel className="h-4 w-4 text-red-500" />
        </Button>
      </BanGroupDialog>
      <PardonGroupDialog selectedItems={selectedItems}>
        <Button
          title="Pardon"
          variant="outline"
          size="icon"
          disabled={selectedItems.size === 0}
          className="border-white hover:bg-white hover:bg-opacity-50"
        >
          <Bird className="h-4 w-4 text-white" />
        </Button>
      </PardonGroupDialog>
      <Button
        variant="outline"
        size="icon"
        className="!ml-auto"
        disabled={pageNumber <= 1}
        onClick={handlePageDown}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={numResults < 10}
        onClick={handlePageUp}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function BanGroupDialog({ children, selectedItems } : { children: React.ReactNode, selectedItems: Map<number,TUser> }) {
  const input_expiry_timestamp = useRef<HTMLInputElement>(null);
  const input_permanent = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const expiry_date:Date = new Date(form.get("expiry_timestamp") as string);
    const data = {
      user_ids: Array.from(selectedItems.keys()) as Array<number>,
      message: form.get("message") as string,
      expiry_timestamp: `${expiry_date.getUTCFullYear()}-${expiry_date.getUTCMonth()+1}-${expiry_date.getUTCDate()} ${expiry_date.getUTCHours()}:${expiry_date.getUTCMinutes()}:${expiry_date.getUTCSeconds()}` as string,
      permanent: form.get("permanent") as string,
    }
    if (data.permanent==null && ( !expiry_date.getTime() || expiry_date.getTime() <= Date.now() || expiry_date.getTime() > 2147483647000)){
      toast.error("Invalid date");
      return;
    }
    await ban_users(data.user_ids, data.permanent=="on" ? null : data.expiry_timestamp, data.message)
      .then(() => toast.success("Users banned successfully"))
      .catch((err) => toast.error("Error banning users", err.message));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <>
          <DialogHeader>
            <DialogTitle>Ban Everyone</DialogTitle>
            <DialogDescription>
              The following nerds will be banned:<br/>
              {[...selectedItems].map((user)=>{return(
                <p key={user[1].id}>
                  {(user[1].displayName||user[1].username)+" [@"+user[1].username+" ID:"+user[1].id+"]"}
                </p>
              )})}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="grid gap-4 py-4">
              {/* Message */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Reason
                </Label>
                <Input
                  maxLength={255}
                  id="message"
                  name="message"
                  className="col-span-3"
                />
              </div>
              {/* permanent */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="permanent" className="text-right">
                  Ban them Forever
                </Label>
                <Input
                  onChange={()=>{
                    if (input_expiry_timestamp.current == null) return;
                    if (input_permanent.current?.checked)
                      input_expiry_timestamp.current.disabled = true;
                    else
                      input_expiry_timestamp.current.disabled = false;
                  }}
                  ref={input_permanent}
                  id="permanent"
                  name="permanent"
                  type="checkbox"
                  className="col-span-3"
                />
              </div>
              {/* Timestamp */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiry_timestamp" className="text-right">
                  Release Date
                </Label>
                <Input
                  ref={input_expiry_timestamp}
                  id="expiry_timestamp"
                  name="expiry_timestamp"
                  type="datetime-local"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"destructive"} type="submit">Ban</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </>
      </DialogContent>
    </Dialog>
  );
}


function PardonGroupDialog({ children, selectedItems } : { children: React.ReactNode, selectedItems: Map<number,TUser> }) {
  
  const handleSubmit = async () => {
    const data = {
      user_ids: Array.from(selectedItems.keys()) as Array<number>,
    }
    await pardon_users(data.user_ids)
      .then(() => toast.success("Users pardoned successfully"))
      .catch((err) => toast.error("Error pardoning users", err.message));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <>
          <DialogHeader>
            <DialogTitle>Mass Pardon</DialogTitle>
            <DialogDescription>
              This action will fully pardon all actions issued against these nerds:<br/>
              {[...selectedItems].map((user)=>{return(
                <p key={user[1].id}>
                  {(user[1].displayName||user[1].username)+" [@"+user[1].username+" ID:"+user[1].id+"]"}
                </p>
              )})}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleSubmit} variant={"destructive"}>OK</Button>
            </DialogClose>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}

