import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Youtube, Instagram, Music2, ImageUp, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { uploadPfp } from "@/api/user";
import { toast } from "sonner";

export function ProfileSettingsCategoryProfile({
  updateSetting,
  findSetting,
}: {
  updateSetting: (key: string, value: string) => void;
  findSetting: (key: string) => string;
}) {
  const { user } = useAuth();

  const [pfpSelected, setPfpSelected] = useState<boolean>(false);

  const pfp_upload_preview = useRef<HTMLDivElement>(null);
  const pfp_upload_input = useRef<HTMLInputElement>(null);

  const api_url: string = import.meta.env.VITE_API_URL;

  const handleSetPfp = async () => {
    if (!pfp_upload_input.current || !pfp_upload_input.current.files) return;
    const avatar = pfp_upload_input.current.files[0];

    try {
      await uploadPfp(avatar);
      toast.success("Avatar Updated");
    } catch (error) {
      toast.error("Failed to upload avatar");
    }
  };

  // Handle file input changes for preview and state update
  const handleFileChange = () => {
    if (!pfp_upload_input.current) return;
    if (!pfp_upload_preview.current) return;
    if (
      !pfp_upload_input.current.files ||
      pfp_upload_input.current.files.length === 0
    ) {
      setPfpSelected(false);
      return;
    }
    setPfpSelected(true);
    const file = pfp_upload_input.current.files[0];
    const url = URL.createObjectURL(file);
    pfp_upload_preview.current.style.backgroundImage = `url(${url})`;
  };

  return (
    <div className="flex flex-col gap-2 self-stretch">
      <div className="flex items-center gap-5 self-stretch">
        <Dialog
          onOpenChange={() => {
            setPfpSelected(false);
          }}
        >
          <DialogTrigger asChild>
            <div
              style={{
                backgroundImage:
                  "url(" + api_url + "/user/pfp/" + user?.id + ")",
              }}
              className={
                "h-[200px] w-[200px] cursor-pointer rounded-[200px] bg-neutral-900 bg-cover bg-center"
              }
            >
              <div className="flex h-[200px] w-[200px] items-center justify-center rounded-[200px] bg-[#44444488] opacity-0 transition-opacity hover:opacity-100">
                <ImageUp className="size-20"></ImageUp>
              </div>
            </div>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 bg-[#111111AA]" />
            <DialogContent>
              <div className="fixed bottom-1/2 left-1/2 right-1/2 top-1/2 z-50 flex h-[400px] max-h-[90%] min-w-[360px] max-w-[90%] translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center rounded-2xl border border-white bg-black">
                <DialogTitle className="absolute top-5">Set Avatar</DialogTitle>
                <div className="flex flex-col items-center py-10">
                  <div
                    ref={pfp_upload_preview}
                    className="h-[200px] w-[200px] rounded-[256px] bg-neutral-900 bg-cover bg-center"
                  ></div>
                  <DialogDescription asChild>
                    <h4>Preview</h4>
                  </DialogDescription>
                </div>
                <input
                  onChange={handleFileChange}
                  ref={pfp_upload_input}
                  type="file"
                  name="pfp"
                  accept="image/jpeg, image/bmp, image/png, image/tiff, image/gif"
                />
                {pfpSelected && <Button onClick={handleSetPfp}>Upload</Button>}
                <DialogClose>
                  <X className="absolute right-5 top-5 size-8"></X>
                </DialogClose>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
        <div className="flex flex-1 flex-col items-start gap-3">
          <div className="flex flex-col items-start justify-center gap-2 self-stretch">
            <h4>Display Name</h4>
            <Input
              maxLength={64}
              onChange={(event) => {
                updateSetting("display_name", event.target.value);
              }}
              defaultValue={findSetting("display_name")}
              placeholder={user?.username}
              className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
            />
          </div>

          <div className="flex flex-col items-start justify-center gap-2 self-stretch">
            <h4 className="text-[#7F7F7E]">Username</h4>
            <Input
              disabled
              value={"@" + user?.username}
              className="flex items-start gap-3 self-stretch rounded-xl border border-[#7F7F7E] bg-black px-4 py-2 text-[#7F7F7E]"
            />
          </div>

          <div className="flex flex-col items-start justify-center gap-2 self-stretch">
            <h4>Status</h4>
            <Input
              maxLength={128}
              onChange={(event) => {
                updateSetting("status", event.target.value);
              }}
              defaultValue={findSetting("status")}
              placeholder="..."
              className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center gap-2 self-stretch">
        <h4>Bio</h4>
        <Textarea
          maxLength={30000}
          onChange={(event) => {
            updateSetting("bio", event.target.value);
          }}
          defaultValue={findSetting("bio")}
          placeholder="write about yourself..."
          className="flex min-h-[67px] items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
        ></Textarea>
      </div>
      <div className="flex items-start justify-center gap-2 self-stretch">
        <div className="flex flex-1 flex-col items-start justify-center gap-2 self-stretch">
          <h4>Pronouns</h4>
          <Input
            maxLength={32}
            onChange={(event) => {
              updateSetting("pronouns", event.target.value);
            }}
            defaultValue={findSetting("pronouns")}
            placeholder="it/that"
            className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
          ></Input>
        </div>

        <div className="flex flex-1 flex-col items-start justify-center gap-2 self-stretch">
          <h4>Location</h4>
          <Input
            maxLength={32}
            onChange={(event) => {
              updateSetting("location", event.target.value);
            }}
            defaultValue={findSetting("location")}
            placeholder="Earth"
            className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
          ></Input>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 self-stretch">
        <div className="flex items-start gap-3">
          <Checkbox
            onCheckedChange={(checked) => {
              updateSetting("public", String(Number(checked)));
            }}
            checked={Boolean(Number(findSetting("public")))}
            className="self-center"
          ></Checkbox>
          <p>Include profile in members section</p>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            onCheckedChange={(checked) => {
              updateSetting("show_adult_content", String(Number(checked)));
            }}
            checked={Boolean(Number(findSetting("show_adult_content")))}
            className="self-center"
          ></Checkbox>
          <p>Show adult content</p>
        </div>
      </div>
      <h3>Socials</h3>
      <hr className="h-px self-stretch bg-[#7F7F7E]" />
      <div className="flex items-start gap-3 self-stretch py-3">
        <div className="flex flex-col gap-[26px] self-stretch py-[5px]">
          <div className="flex items-center gap-3">
            <Instagram />
            <h4>Instagram</h4>
          </div>
          <div className="flex items-center gap-3">
            <Youtube />
            <h4>Youtube</h4>
          </div>
          <div className="flex items-center gap-3">
            <Music2 />
            <h4>Tiktok</h4>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-5">
          <Input
            maxLength={255}
            onChange={(event) => {
              updateSetting("social_instagram", event.target.value);
            }}
            defaultValue={findSetting("social_instagram")}
            placeholder="https://www.instagram.com/username/"
            className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
          ></Input>
          <Input
            maxLength={255}
            onChange={(event) => {
              updateSetting("social_youtube", event.target.value);
            }}
            defaultValue={findSetting("social_youtube")}
            placeholder="https://www.youtube.com/username/"
            className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
          ></Input>
          <Input
            maxLength={255}
            onChange={(event) => {
              updateSetting("social_tiktok", event.target.value);
            }}
            defaultValue={findSetting("social_tiktok")}
            placeholder="https://www.tiktok.com/@username/"
            className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
          ></Input>
        </div>
      </div>
    </div>
  );
}
