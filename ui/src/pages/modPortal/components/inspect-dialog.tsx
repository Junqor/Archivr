import { get_user_offences } from "@/api/moderation";
import { Button } from "@/components/ui/button";
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TUser, TUserOffence } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext, useEffect, useState } from "react";

export function InspectDialog({ children, user } : { children: React.ReactNode, user: TUser }) {
  const [page,setPage] = useState<number>(0);
  const [open,setOpen] = useState<boolean>(false);
  const {data: inspectData, isFetching, error, refetch} = useQuery<TUserOffence[]>({
    queryKey: ["modInspect", user.id, page],
    queryFn: async () => {
      const data = await get_user_offences(user.id,8,page*8);
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: open,
  });

  return (
    <Dialog onOpenChange={(open)=>{
      setOpen(open); 
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[50%] max-h-[80%] overflow-y-auto">
        <>
          <DialogHeader>
            <DialogTitle className="flex gap-2">
              Peering into the annals of {user.username}
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
            Crimes committed:
            <br/>
            {isFetching && (<LoadingSpinner></LoadingSpinner>)}
            {inspectData && (<Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Action</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Pardoned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspectData.map((item:TUserOffence)=>{
                  return (<TableRow key={item.id}>
                    <TableCell>{item.action_type}</TableCell>
                    <TableCell>{item.message}</TableCell>
                    <TableCell>{item.timestamp}</TableCell>
                    <TableCell>{item.expiry_date || "never"}</TableCell>
                    <TableCell>{item.pardon_timestamp || "--"}</TableCell>
                  </TableRow>)
                })}
              </TableBody>
            </Table>)}
          </DialogHeader>
        </>
      </DialogContent>
    </Dialog>
  );
}