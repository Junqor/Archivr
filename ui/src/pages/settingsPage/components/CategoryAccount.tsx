import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

export function ProfileSettingsCategoryAccount() {
  const { user } = useAuth();
  const email = user?.email;

  return (
    <div className="flex flex-col gap-2 self-stretch">
      <h4>Email</h4>
      <Input
        disabled
        value={email ? email : "???"}
        className="flex items-start gap-3 self-stretch rounded-xl border border-[#7F7F7E] bg-black px-4 py-2 text-[#7F7F7E]"
      ></Input>
      <h3>Change Password</h3>
      <hr className="h-px self-stretch bg-[#7F7F7E]"></hr>
      <h4>Current Password</h4>
      <Input
        type="password"
        placeholder="Enter current password"
        className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
      ></Input>
      <h4>New Password</h4>
      <Input
        type="password"
        placeholder="Enter new password"
        className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
      ></Input>
      <h4>Confirm New Password</h4>
      <Input
        type="password"
        placeholder="Enter new password again"
        className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
      ></Input>
      <Button className="mt-2 max-w-[130px]">Save Changes</Button>
      <h3>Account Data</h3>
      <hr className="h-px self-stretch bg-[#7F7F7E]"></hr>
      {/*
            Uneeded as all the settings are on the glorious MySQL database
            <div className="flex gap-3">
                <Button variant={"outline"} className="max-w-[130px]">Import Your Data</Button>
                <Button variant={"outline"} className="max-w-[130px]">Export Your Data</Button>
            </div>
            */}
      <p
        onClick={() => {
          toast.success("Your account has been permanantly deleted");
        }}
        className="cursor-pointer py-2 underline transition-colors hover:text-red-500"
      >
        Disable Account
      </p>
    </div>
  );
}
