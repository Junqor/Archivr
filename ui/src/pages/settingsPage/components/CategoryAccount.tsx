import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

export function ProfileSettingsCategoryAccount() {
  const { user } = useAuth();
  const email = user?.email;

  return (
    <div className="flex flex-col gap-4 self-stretch">
      <Label>Email</Label>
      <Input
        disabled
        value={email ? email : "???"}
        className="flex items-start gap-3 self-stretch rounded-xl border px-4 py-2 dark:placeholder:text-neutral-500 dark:disabled:bg-black/80"
      ></Input>
      <div className="w-full">
        <h3>Change Password</h3>
        <Separator decorative />
      </div>
      <Label>Current Password</Label>
      <Input
        type="password"
        placeholder="Enter current password"
        className="flex items-start gap-3 self-stretch rounded-xl border px-4 py-2 dark:placeholder:text-neutral-500 dark:disabled:bg-black/80"
      ></Input>
      <Label>New Password</Label>
      <Input
        type="password"
        placeholder="Enter new password"
        className="flex items-start gap-3 self-stretch rounded-xl border px-4 py-2 dark:placeholder:text-neutral-500 dark:disabled:bg-black/80"
      ></Input>
      <Label>Confirm New Password</Label>
      <Input
        type="password"
        placeholder="Enter new password again"
        className="flex items-start gap-3 self-stretch rounded-xl border px-4 py-2 dark:placeholder:text-neutral-500 dark:disabled:bg-black/80"
      ></Input>
      <Button className="w-fit self-center">Save Changes</Button>
      <h3>Account Data</h3>
      <div className="h-px self-stretch bg-black dark:bg-[#7F7F7E]"></div>
      {/*
            Uneeded as all the settings are on the glorious MySQL database
            <div className="flex gap-3">
                <Button variant={"outline"} className="max-w-[130px]">Import Your Data</Button>
                <Button variant={"outline"} className="max-w-[130px]">Export Your Data</Button>
            </div>
            */}
      <p
        onClick={() => {
          toast.success("Your account has been permanently deleted");
        }}
        className="w-fit cursor-pointer py-2 underline transition-colors hover:text-red-500"
      >
        Disable Account
      </p>
    </div>
  );
}
