import { get_user_offences, is_user_banned, pardon_action } from "@/api/moderation";
import { TUserProfile } from "@/api/user";
import { Button } from "@/components/ui/button";
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TUserOffence } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { Bird, ChevronLeft, ChevronRight, Frown, Laugh } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function InspectDialog({ children, user } : { children: React.ReactNode, user: TUserProfile }) {
  const [page,setPage] = useState<number>(0);
  const [open,setOpen] = useState<boolean>(false);
  const {data: inspectData, isFetching} = useQuery<TUserOffence[]>({
    queryKey: ["modInspect", user.id, page],
    queryFn: async () => {
      const data = await get_user_offences(user.id,8,page*8);
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: open,
  });

  const {data: banned} = useQuery<boolean|undefined>({
    queryKey: ["modIsUserBanned", user.id],
    queryFn: async () => {
      const {is_banned} = await is_user_banned(user.id);
      return is_banned;
    },
    refetchOnWindowFocus: false,
    enabled: open,
  })

  return (
    <Dialog onOpenChange={(open)=>{
      setOpen(open); 
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[60%] max-h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            The annals of {user.username}
            <Button
              variant="outline"
              size="icon"
              className="!ml-auto"
              disabled={page <= 0}
              onClick={()=>{setPage(page-1)}}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!inspectData || inspectData.length < 8}
              onClick={()=>{setPage(page+1)}}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div>
        {banned === true && 
          <div className="inline-block p-2 rounded-2xl border border-red-500 bg-red-500 bg-opacity-20">
            <div className="flex gap-2">
              <Laugh className="stroke-red-500"></Laugh>
              <p className="text-red-500">{user.username+" is banned! so cool!"}</p>
            </div>
          </div>
        }
        {banned === false &&
          <div className="inline-block p-2 rounded-2xl border border-green-400 bg-green-400 bg-opacity-20">
            <div className="flex gap-2">
              <Frown className="stroke-green-400"></Frown>
              <p className="text-green-400">{user.username+" is not banned"}</p>
            </div>
          </div>
        }
        </div>
        {isFetching && (<LoadingSpinner></LoadingSpinner>)}
        {inspectData && (<Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]">Pardon</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Pardon Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspectData.map((item:TUserOffence)=>{
              return (<TableRow key={item.id}>
                <TableCell>{!item.pardon_timestamp?
                  (<PardonDialog id={item.id}><Bird className="cursor-pointer hover:stroke-purple"/></PardonDialog>)
                  :
                  (<Bird className="stroke-gray-500"/>)
                }</TableCell>
                <TableCell>{item.action_type}</TableCell>
                <TableCell className="break-all">{item.message}</TableCell>
                <TableCell>{item.timestamp ? new Date(item.timestamp).toLocaleString() : "--"}</TableCell>
                <TableCell>{item.expiry_date ? new Date(item.expiry_date).toLocaleString() : "Indefinite"}</TableCell>
                <TableCell>{item.pardon_timestamp ? new Date(item.pardon_timestamp).toLocaleString() : "--"}</TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>)}
      </DialogContent>
    </Dialog>
  );
}

function PardonDialog({ children, id } : { children: React.ReactNode, id: number }) {
  
  const handleSubmit = async () => {
    await pardon_action(id)
      .then(() => toast.success("Action pardoned successfully"))
      .catch((err) => toast.error("Error pardoning action", err.message));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <>
          <DialogHeader>
            <DialogTitle>Pardon this action</DialogTitle>
            <DialogDescription>
              the user will be let off scott-free for their crime.
              <br/>
              YOU SURE???
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleSubmit} variant={"destructive"}>UH-HUH!</Button>
            </DialogClose>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}