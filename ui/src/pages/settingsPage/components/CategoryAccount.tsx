import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileSettingsCategoryAccount({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>(string|null)}){
    const hash = localStorage.getItem("access_token")?.split('.')[1];
    let email:string = "";
    if (hash){
        email = atob(hash);
        email = JSON.parse(email).user.email;
    }
    
    return (
        <div className="flex flex-col gap-2 self-stretch">
            <p className="text-base font-medium leading-normal text-[#7F7F7E]">
                Email
            </p>
            <Input disabled value={email?email:"???"} className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-[#7F7F7E] text-[#7F7F7E] bg-black">
            </Input>
            <p className="text-white text-2xl font-light leading-normal">
                Change Password
            </p>
            <line className="w-[600px] h-px bg-[#7F7F7E]"></line>
            <p className="text-base font-medium leading-normal">
                Current Password
            </p>
            <Input type="password" placeholder="Enter current password" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
            </Input>
            <p className="text-base font-medium leading-normal">
                New Password
            </p>
            <Input type="password" placeholder="Enter new password"className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
            </Input>
            <p className="text-base font-medium leading-normal">
                Confirm New Password
            </p>
            <Input type="password" placeholder="Enter new password again" className="flex py-2 px-4 items-start gap-3 self-stretch rounded-xl border border-white bg-black">
            </Input>
            <Button className="max-w-[130px]">Save Changes</Button>
            <p className="text-white text-2xl font-light leading-normal">
                Account Data
            </p>
            <line className="w-[600px] h-px bg-[#7F7F7E]"></line>
            {/*
            Uneeded as all the settings are on the glorious MySQL database
            <div className="flex gap-3">
                <Button variant={"outline"} className="max-w-[130px]">Import Your Data</Button>
                <Button variant={"outline"} className="max-w-[130px]">Export Your Data</Button>
            </div>
            */}
            <p className="underline py-2">
                Disable Account
            </p>
        </div>
    )
}