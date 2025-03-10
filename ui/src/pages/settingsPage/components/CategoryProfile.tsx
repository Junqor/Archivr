import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUp, X } from "lucide-react";
import { Instagram, YouTube, AudiotrackRounded } from "@mui/icons-material";
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
import { TUserSettings } from "../settingsPage";
import { useSettings } from "@/context/settings";

export function ProfileSettingsCategoryProfile({
  updateSetting,
  settings,
}: {
  updateSetting: (key: keyof TUserSettings, value: string) => void;
  settings: TUserSettings;
}) {
  const { user } = useAuth();
  const { settings: _settings, refetchSettings } = useSettings();

  const [pfpSelected, setPfpSelected] = useState<boolean>(false);

  const pfp_upload_preview = useRef<HTMLDivElement>(null);
  const pfp_upload_input = useRef<HTMLInputElement>(null);

  const handleSetPfp = async () => {
    if (!pfp_upload_input.current || !pfp_upload_input.current.files) return;
    const avatar = pfp_upload_input.current.files[0];

    try {
      await uploadPfp(avatar);
      refetchSettings();
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
      <div className="flex w-full flex-col items-center gap-5 self-stretch sm:flex-row">
        <Dialog
          onOpenChange={() => {
            setPfpSelected(false);
          }}
        >
          <DialogTrigger asChild>
            <div
              style={{
                backgroundImage: `url(${_settings?.avatar_url})`,
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
                  id="pfp"
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
        <div className="flex w-full flex-1 flex-col items-start gap-3">
          <div className="flex flex-col items-start justify-center gap-2 self-stretch">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              maxLength={64}
              onChange={(event) => {
                updateSetting("displayName", event.target.value);
              }}
              defaultValue={settings.displayName || ""}
              placeholder={user?.username}
              className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
              id="display_name"
            />
          </div>

          <div className="flex flex-col items-start justify-center gap-2 self-stretch">
            <Label className="text-[#7F7F7E]" htmlFor="username">
              Username
            </Label>
            <Input
              disabled
              value={"@" + user?.username}
              className="flex items-start gap-3 self-stretch rounded-xl border border-[#7F7F7E] bg-black px-4 py-2 text-[#7F7F7E]"
              id="username"
            />
          </div>

          <div className="flex flex-col items-start justify-center gap-2 self-stretch">
            <Label htmlFor="status">Status</Label>
            <Input
              maxLength={128}
              onChange={(event) => {
                updateSetting("status", event.target.value);
              }}
              defaultValue={settings.status || ""}
              placeholder="What's on your mind?"
              className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
              id="status"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center gap-2 self-stretch">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          maxLength={30000}
          onChange={(event) => {
            updateSetting("bio", event.target.value);
          }}
          defaultValue={settings.bio || ""}
          placeholder="Tell us a little about yourself..."
          className="flex min-h-[67px] items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
          id="bio"
        ></Textarea>
      </div>
      <div className="flex flex-col items-start justify-center gap-3 self-stretch sm:flex-row">
        <div className="flex flex-col items-start justify-center gap-2 self-stretch sm:flex-1">
          <Label htmlFor="pronouns">Pronouns</Label>
          <Input
            maxLength={32}
            onChange={(event) => {
              updateSetting("pronouns", event.target.value);
            }}
            defaultValue={settings.pronouns || ""}
            placeholder="e.g. She/Her, He/Him, They/Them"
            className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
            id="pronouns"
          ></Input>
        </div>

        <div className="flex flex-col items-start justify-center gap-2 self-stretch sm:flex-1">
          <Label htmlFor="location">Location</Label>
          <Input
            maxLength={32}
            onChange={(event) => {
              updateSetting("location", event.target.value);
            }}
            defaultValue={settings.location || ""}
            placeholder="Earth"
            className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
            id="location"
          ></Input>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 self-stretch">
        <div className="flex items-start gap-3">
          <Checkbox
            onCheckedChange={(checked) => {
              updateSetting("public", String(Number(checked)));
            }}
            checked={Boolean(Number(settings.public || ""))}
            className="self-center"
          ></Checkbox>
          <p>Include profile in members section</p>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            onCheckedChange={(checked) => {
              updateSetting("show_adult_content", String(Number(checked)));
            }}
            checked={Boolean(Number(settings.show_adult_content || ""))}
            className="self-center"
          ></Checkbox>
          <p>Show adult content</p>
        </div>
      </div>
      <h3>Socials</h3>
      <hr className="h-px self-stretch bg-[#7F7F7E]" />
      <div className="flex items-start gap-3 self-stretch py-3">
        <div className="flex w-full flex-col gap-[26px] self-stretch py-[5px]">
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <div className="flex items-center gap-3 sm:w-1/4">
                <Instagram />
                <Label htmlFor="social_instagram">Instagram</Label>
              </div>
              <Input
                maxLength={255}
                onChange={(event) => {
                  updateSetting("social_instagram", event.target.value);
                }}
                defaultValue={settings.social_instagram || ""}
                placeholder="https://www.instagram.com/username/"
                className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
                id="social_instagram"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex items-center gap-3 sm:w-1/4">
                <YouTube />
                <Label htmlFor="social_youtube">Youtube</Label>
              </div>
              <Input
                maxLength={255}
                onChange={(event) => {
                  updateSetting("social_youtube", event.target.value);
                }}
                defaultValue={settings.social_youtube || ""}
                placeholder="https://www.youtube.com/username/"
                className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
                id="social_youtube"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex items-center gap-3 sm:w-1/4">
                <AudiotrackRounded />
                <Label htmlFor="social_tiktok">Tiktok</Label>
              </div>
              <Input
                maxLength={255}
                onChange={(event) => {
                  updateSetting("social_tiktok", event.target.value);
                }}
                defaultValue={settings.social_tiktok || ""}
                placeholder="https://www.tiktok.com/@username/"
                className="flex items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2"
                id="social_tiktok"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
