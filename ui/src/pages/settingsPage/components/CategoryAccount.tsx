import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ProfileSettingsCategoryAccount(){
    const hash = localStorage.getItem("access_token")?.split('.')[1];
    let email:string = "";
    if (hash){
        email = atob(hash);
        email = JSON.parse(email).user.email;
    }
    
    return (
        <div className="flex flex-col gap-2 self-stretch">
            <h4>
                Email
            </h4>
            <Input disabled value={email?email:"???"} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-[#7F7F7E] text-[#7F7F7E] bg-black">
            </Input>
            <h3>
                Change Password
            </h3>
            <line className="self-stretch h-px bg-[#7F7F7E]"></line>
            <h4>
                Current Password
            </h4>
            <Input type="password" placeholder="Enter current password" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
            </Input>
            <h4>
                New Password
            </h4>
            <Input type="password" placeholder="Enter new password"className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
            </Input>
            <h4>
                Confirm New Password
            </h4>
            <Input type="password" placeholder="Enter new password again" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
            </Input>
            <Button className="mt-2 max-w-[130px]">Save Changes</Button>
            <h3>
                Account Data
            </h3>
            <line className="self-stretch h-px bg-[#7F7F7E]"></line>
            {/*
            Uneeded as all the settings are on the glorious MySQL database
            <div className="flex gap-3">
                <Button variant={"outline"} className="max-w-[130px]">Import Your Data</Button>
                <Button variant={"outline"} className="max-w-[130px]">Export Your Data</Button>
            </div>
            */}
            <p onClick={()=>{toast.success("Your account has been permanantly deleted")}} className="underline py-2 cursor-pointer hover:text-red-500">
                Disable Account
            </p>
        </div>
    )
}