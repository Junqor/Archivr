import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getUserSettings, setUserSettings } from "@/api/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileSettingsCategoryProfile } from "./components/CategoryProfile";
import { ProfileSettingsCategoryAccount } from "./components/CategoryAccount";
import { ProfileSettingsCategoryAppearance } from "./components/CategoryAppearance";
import { ProfileSettingsCategoryActivity } from "./components/CategoryActivity";
import { ProfileSettingsCategoryHelpAndSupport } from "./components/CategoryHelpAndSupport";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/context/auth";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useSettings } from "@/context/settings";

export type TUserSettings = {
  displayName: string | null;
  status: string | null;
  bio: string | null;
  pronouns: string | null;
  location: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_tiktok: string | null;
  public: number | null;
  show_adult_content: number | null;
  theme: string | null;
  font_size: string | null;
  grant_personal_data: number | null;
  show_personalized_content: number | null;
};

export function ProfileSettings() {
  const [newSettings, setNewSettings] = useState<TUserSettings>({
    displayName: null,
    status: null,
    bio: null,
    pronouns: null,
    location: null,
    social_instagram: null,
    social_youtube: null,
    social_tiktok: null,
    public: null,
    show_adult_content: null,
    theme: null,
    font_size: null,
    grant_personal_data: null,
    show_personalized_content: null,
  });
  const [changedSettingsKeys, setChangedSettingsKeys] = useState<
    Set<keyof TUserSettings>
  >(new Set());
  const [selectedMenu, setSelectedMenu] = useState("Profile");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { refetchSettings } = useSettings();

  if (!user) return <Navigate to="/login" />;

  const {
    error: query_error,
    isPending,
    isLoading,
    data: currentSettings,
  } = useQuery({
    queryKey: ["settingsCurrentSettings"],
    queryFn: () => getUserSettings(),
  });

  const { error: mutate_error, mutate: applyChangedSettings } = useMutation({
    mutationFn: () => setUserSettings(newSettings),
    onSuccess: () => {
      setChangedSettingsKeys(new Set());
      refetchSettings();
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settingsCurrentSettings"] });
    },
    onError: () => {
      toast.error("Failed to update settings");
    },
  });

  useEffect(() => {
    if (currentSettings) {
      setNewSettings(currentSettings);
    }
  }, [currentSettings]);

  const updateSetting = (key: keyof TUserSettings, value: string) => {
    if (currentSettings[key] === value) changedSettingsKeys.delete(key);
    else changedSettingsKeys.add(key);
    setNewSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  if (query_error || mutate_error) {
    throw new Error("Error fetching settings");
  }

  if (isPending || isLoading) return <LoadingSpinner />;

  return (
    <>
      <div
        className={
          "flex min-h-[calc(100vh-100px)] w-full items-start rounded-3xl border border-white bg-black" +
          (isPending ? " hidden" : "")
        }
      >
        <ProfileSettingsMenu
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        ></ProfileSettingsMenu>
        <div className="w-px self-stretch bg-white"></div>
        <div className="flex w-[67%] flex-col items-start gap-1 self-stretch p-5">
          <h3>{selectedMenu}</h3>
          <div className="mb-3 h-px self-stretch bg-[#7F7F7E]"></div>
          {selectedMenu == "Profile" ? (
            <ProfileSettingsCategoryProfile
              updateSetting={updateSetting}
              settings={newSettings}
            />
          ) : null}
          {selectedMenu == "Account" ? (
            <ProfileSettingsCategoryAccount></ProfileSettingsCategoryAccount>
          ) : null}
          {selectedMenu == "Appearance" ? (
            <ProfileSettingsCategoryAppearance
              updateSetting={updateSetting}
              settings={newSettings}
            ></ProfileSettingsCategoryAppearance>
          ) : null}
          {selectedMenu == "Activity" ? (
            <ProfileSettingsCategoryActivity
              updateSetting={updateSetting}
              settings={newSettings}
            ></ProfileSettingsCategoryActivity>
          ) : null}
          {selectedMenu == "Help & Support" ? (
            <ProfileSettingsCategoryHelpAndSupport></ProfileSettingsCategoryHelpAndSupport>
          ) : null}
        </div>
      </div>
      {changedSettingsKeys.size > 0 ? (
        <div className="fixed bottom-5 flex items-center justify-center gap-3 rounded-2xl border border-white bg-black p-3">
          <h4 className="flex self-center">
            {changedSettingsKeys.size}{" "}
            {changedSettingsKeys.size != 1
              ? "settings have been modified"
              : "setting has been modified"}
          </h4>
          <Button
            onClick={() => {
              applyChangedSettings();
            }}
            variant={"default"}
          >
            Apply Changes
          </Button>
        </div>
      ) : null}
    </>
  );
}

function ProfileSettingsMenu({
  selectedMenu,
  setSelectedMenu,
}: {
  selectedMenu: string;
  setSelectedMenu: (a: string) => void;
}) {
  return (
    <div className="flex min-w-[33%] flex-shrink-0 flex-col">
      <div className="flex items-center justify-between self-stretch border-b border-white px-3 py-5">
        <h3>Settings</h3>
        <Search className="h-[21px] w-[21px]"></Search>
      </div>
      <div className="flex flex-col items-start self-stretch">
        <ProfileSettingsMenuButton
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          category="Profile"
        ></ProfileSettingsMenuButton>
        <hr className="h-[1px] self-stretch bg-[#7F7F7E]"></hr>
        <ProfileSettingsMenuButton
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          category="Account"
        ></ProfileSettingsMenuButton>
        <hr className="h-[1px] self-stretch bg-[#7F7F7E]"></hr>
        <ProfileSettingsMenuButton
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          category="Appearance"
        ></ProfileSettingsMenuButton>
        <hr className="h-[1px] self-stretch bg-[#7F7F7E]"></hr>
        <ProfileSettingsMenuButton
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          category="Activity"
        ></ProfileSettingsMenuButton>
        <hr className="h-[1px] self-stretch bg-[#7F7F7E]"></hr>
        <ProfileSettingsMenuButton
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          category="Help & Support"
        ></ProfileSettingsMenuButton>
        <hr className="h-[1px] self-stretch bg-[#7F7F7E]"></hr>
      </div>
    </div>
  );
}

function ProfileSettingsMenuButton({
  category,
  selectedMenu,
  setSelectedMenu,
}: {
  category: string;
  selectedMenu: string;
  setSelectedMenu: (a: string) => void;
}) {
  return (
    <div
      onClick={() => {
        setSelectedMenu(category);
      }}
      className={
        "flex items-center gap-3 self-stretch border-r-8 border-solid px-3 py-5 transition-colors hover:bg-neutral-900 " +
        (category == selectedMenu ? " border-purple" : " border-[#7F7F7E]")
      }
    >
      <h4>{category}</h4>
    </div>
  );
}
