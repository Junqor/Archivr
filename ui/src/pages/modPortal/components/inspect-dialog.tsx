import { get_user_offences } from "@/api/moderation";
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { TUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export function InspectDialog({ children, user } : { children: React.ReactNode, user: TUser }) {
  const {data: inspectData, isFetching, error, refetch} = useQuery({
    queryKey: ["modInspect", user.id],
    queryFn: async () => {
      const data = await get_user_offences(user.id);
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
  });

  console.log(inspectData);
  return (
    <Dialog onOpenChange={(open)=>{
      if (open) refetch(); 
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <>
          <DialogHeader>
            <DialogTitle>Peering into the annals of {user.username}</DialogTitle>
            Crimes committed:
            <br/>
            {isFetching && (<>loding ofences</>)}
            {inspectData && (<>{"ya"}</>)}
          </DialogHeader>
        </>
      </DialogContent>
    </Dialog>
  );
}