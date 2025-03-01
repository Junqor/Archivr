import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getUserSettings, setUserSettings } from "@/api/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProfileSettingsCategoryProfile } from "./components/CategoryProfile";
import { ProfileSettingsCategoryAccount } from "./components/CategoryAccount";
import { ProfileSettingsCategoryAppearance } from "./components/CategoryAppearance";
import { ProfileSettingsCategoryActivity } from "./components/CategoryActivity";
import { ProfileSettingsCategoryHelpAndSupport } from "./components/CategoryHelpAndSupport";
import { useSettings } from "@/context/settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/context/auth";

export function ProfileSettings() {
  const [changedSettings, setChangedSettings] = useState<Map<string, string>>(
    new Map<string, string>(),
  );

  const [selectedMenu, setSelectedMenu] = useState("Profile");

  const { user } = useAuth();

  if (!user)
    throw new Error(
      "user doesnt exist in page that already kicks you if you're not logged in",
    );

  const { refetchSettings: refetchUserSettings } = useSettings();

  const {
    error: query_error,
    isPending: query_isPending,
    data: currentSettings,
    refetch: refetchCurrentSettings,
  } = useQuery({
    queryKey: ["settingsCurrentSettings", user.id.toString()],
    queryFn: async () => {
      const a = await getUserSettings();
      const b = new Map<string, string>();
      for (const [key, value] of Object.entries(a)) {
        b.set(key, String(value));
      }
      const c = new Map<string, string>();
      changedSettings.forEach((value: string, key: string) => {
        if (value != b.get(key)) {
          c.set(key, value);
        }
      });
      setChangedSettings(c);
      refetchUserSettings();
      return b;
    },
  });

  const {
    error: mutate_error,
    isPending: mutate_isPending,
    mutate: applyChangedSettings,
  } = useMutation({
    mutationFn: async () => {
      await setUserSettings(changedSettings);
      refetchCurrentSettings();
      setChangedSettings(new Map<string, string>());
    },
  });

  const updateSetting = (key: string, value: string) => {
    const currentValue = currentSettings?.get(key);
    const map: Map<string, string> = new Map<string, string>();
    changedSettings.forEach((old_value: string, old_key: string) => {
      if (old_key == key) {
        if (value != currentValue) {
          map.set(old_key, value);
        }
      } else {
        map.set(old_key, old_value);
      }
    });
    if (!changedSettings.has(key) && value != currentValue) {
      map.set(key, value);
    }
    setChangedSettings(map);
  };

  const findSetting = (key: string): string => {
    const changedValue = changedSettings.get(key);
    if (changedValue != null) {
      return changedValue;
    }
    const currentValue = currentSettings?.get(key);
    if (currentValue != null) {
      return currentValue;
    }
    return "";
  };

  if (query_error || mutate_error) {
    throw new Error("Error fetching settings");
    return null;
  }

  const isPending = query_isPending || mutate_isPending;

  return (
    <>
      {isPending ? <LoadingSpinner></LoadingSpinner> : null}
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
              findSetting={findSetting}
            ></ProfileSettingsCategoryProfile>
          ) : null}
          {selectedMenu == "Account" ? (
            <ProfileSettingsCategoryAccount></ProfileSettingsCategoryAccount>
          ) : null}
          {selectedMenu == "Appearance" ? (
            <ProfileSettingsCategoryAppearance
              updateSetting={updateSetting}
              findSetting={findSetting}
            ></ProfileSettingsCategoryAppearance>
          ) : null}
          {selectedMenu == "Activity" ? (
            <ProfileSettingsCategoryActivity
              updateSetting={updateSetting}
              findSetting={findSetting}
            ></ProfileSettingsCategoryActivity>
          ) : null}
          {selectedMenu == "Help & Support" ? (
            <ProfileSettingsCategoryHelpAndSupport></ProfileSettingsCategoryHelpAndSupport>
          ) : null}
        </div>
      </div>
      {changedSettings.size > 0 ? (
        <div className="fixed bottom-5 flex items-center justify-center gap-3 rounded-2xl border border-white bg-black p-3">
          <h4 className="flex self-center">
            {changedSettings.size}{" "}
            {changedSettings.size != 1
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
