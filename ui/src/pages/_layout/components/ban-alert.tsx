import { TUserBanData } from "@/api/moderation";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function BANner({banData}:{banData:TUserBanData}) {
  return(
  <div className="bg-gradient-to-tr from-red-900 via-red-600 to-orange-600">
    <div className="flex flex-col items-center justify-center p-3 relative">
      <div className="absolute top-0 right-0 flex items-center justify-center w-20 h-16">
        <BanDialog banData={banData}>
          <CircleHelp className="cursor-pointer transition-transform size-7 hover:size-8"/>
        </BanDialog>
      </div>
      <p className="text-4xl font-extrabold">Hey, IDIOT! You've been BANNED!</p>
      <p className="text-xl font-light">Reason: {banData.message ? '"'+banData.message+'"' : "WHO CARES"}</p>
      <p className="text-2xl font-bold">You can wreak more havok in:</p>
      <p className={"text-4xl font-bold"}>{banData.expiry_date ? <BanTimer unban_time={new Date(banData.expiry_date)}/> : "NEVER"}</p>
    </div>
  </div>
  )
}

function BanTimer({unban_time}:{unban_time: Date}){
  const [time, setTime] = useState<string>("XX:XX:XX");
  const [blink, setBlink] = useState<boolean>(false);
  useEffect(()=>{
    const interval = setInterval(() => {
    const diff = (unban_time.getTime() - Date.now());
    if (diff <= 0){
      setTime("RIGHT NOW; GO CRAZY!");
      setBlink(true);
    }
    else {
      const date = new Date(0);
      date.setMilliseconds(diff);
      const days = Math.floor(diff/86400000);
      setTime(days+":"+date.toISOString().slice(11, 23));
      if (diff%1000 > 750) setBlink(true);
      else setBlink(false);
    }
    }, 20);
  
    return () => clearInterval(interval);
  });
  
  return (
    <div className={"bg-black px-8 text-center font-mono " + (blink ? "text-[#FF0000]" : "")}>
    {time}
    </div>
  );
}

function BanDialog({children, banData}:{children:React.ReactNode, banData:TUserBanData }){
  return(
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h2>You're banned.</h2>
        </DialogHeader>
        {banData.message ?
          <p><h4>You were banned for this reason:</h4><br/>"{banData.message}"</p>
        :
          <h4>No message was given with your ban.</h4>
        }
        <p>Because you are banned you will not be able to post replies and do stuff like that. If you try to do something and it says an unexpected error occurred, the unexpected error was probably you, you despicable scum.</p>
        <p>You can make an appeal for your unbanning by clicking <button onClick={()=>{toast.success("No you cant. LMAO");}} className="text-purple underline">here</button></p>
        {banData.expiry_date ?
          <h4>You will be banned until {new Date(banData.expiry_date).toLocaleString()}</h4>
        :
          <h4>You are banned indefinitely</h4>
        }
      </DialogContent>
    </Dialog>
  )
}