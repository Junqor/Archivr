import { Ellipsis, Settings } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

const categories = [
  "Profile",
  "Account",
  "Appearance",
  "Activity",
  "Help & Support",
] as const;

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
  const [selectedMenu, setSelectedMenu] =
    useState<(typeof categories)[number]>("Profile");
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

  const { mutate: applyChangedSettings } = useMutation({
    mutationFn: () => setUserSettings(newSettings),
    onSuccess: () => {
      setChangedSettingsKeys(new Set());
      refetchSettings();
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settingsCurrentSettings"] });
    },
    onError: (e) => {
      toast.error(e.message);
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

  if (query_error) {
    throw new Error("Error fetching settings");
  }

  if (isPending || isLoading) return <LoadingSpinner />;

  return (
    <>
      <div
        className={
          "flex min-h-[calc(100vh-100px)] w-full flex-col items-start rounded-3xl border border-black dark:border-white sm:flex-row" +
          (isPending ? " hidden" : "")
        }
      >
        <ProfileSettingsMenu
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        ></ProfileSettingsMenu>
        <div className="w-px self-stretch bg-black dark:bg-white"></div>
        <div className="flex flex-col items-start gap-1 gap-y-5 self-stretch p-5 sm:w-[67%]">
          <div className="w-full">
            <h3>{selectedMenu}</h3>
            <Separator decorative />
          </div>
          {selectedMenu == "Profile" ? (
            <ProfileSettingsCategoryProfile
              updateSetting={updateSetting}
              settings={newSettings}
            />
          ) : null}
          {selectedMenu == "Account" && <ProfileSettingsCategoryAccount />}
          {selectedMenu == "Appearance" && (
            <ProfileSettingsCategoryAppearance />
          )}
          {selectedMenu == "Activity" && (
            <ProfileSettingsCategoryActivity
              updateSetting={updateSetting}
              settings={newSettings}
            />
          )}
          {selectedMenu == "Help & Support" && (
            <ProfileSettingsCategoryHelpAndSupport />
          )}
        </div>
      </div>
      {changedSettingsKeys.size > 0 ? (
        <div className="fixed bottom-5 flex items-center justify-center gap-3 rounded-2xl border border-black bg-white p-3 dark:border-white dark:bg-black">
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
  setSelectedMenu: (a: (typeof categories)[number]) => void;
}) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <div className="flex min-w-full flex-shrink-0 flex-col sm:min-w-[33%]">
      <div className="flex items-center justify-between self-stretch border-b border-black px-3 py-5 dark:border-white">
        <h3>Settings</h3>
        <Settings className="hidden h-[21px] w-[21px] sm:block"></Settings>
        <Button
          variant="ghost"
          className={cn(
            "bg-white/10 px-1 sm:hidden",
            categoriesOpen && "text-primary",
          )}
          onClick={() => {
            setCategoriesOpen((categoriesOpen) => !categoriesOpen);
          }}
        >
          <Ellipsis />
        </Button>
      </div>
      {/* Mobile */}
      {categoriesOpen && (
        <div className="flex flex-col gap-y-2 p-2 sm:hidden">
          {categories.map((category) => (
            <ProfileSettingsMenuButtonMobile
              key={category + "-mobile"}
              category={category}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
            />
          ))}
        </div>
      )}
      {/* Desktop */}
      <div className="hidden flex-col items-start self-stretch sm:flex">
        {categories.map((category) => (
          <Fragment key={category + "-desktop"}>
            <ProfileSettingsMenuButton
              category={category}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
            />
            <div className="h-[1px] self-stretch bg-[#7F7F7E]"></div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ProfileSettingsMenuButton({
  category,
  selectedMenu,
  setSelectedMenu,
}: {
  category: (typeof categories)[number];
  selectedMenu: string;
  setSelectedMenu: (a: (typeof categories)[number]) => void;
}) {
  return (
    <div
      onClick={() => {
        setSelectedMenu(category);
      }}
      className={
        "flex cursor-pointer items-center gap-3 self-stretch border-r-8 border-solid px-3 py-5 transition-colors duration-300 hover:bg-neutral-300 dark:hover:bg-neutral-900 " +
        (category == selectedMenu ? " border-purple" : " border-[#7F7F7E]")
      }
    >
      <h4>{category}</h4>
    </div>
  );
}

function ProfileSettingsMenuButtonMobile({
  category,
  selectedMenu,
  setSelectedMenu,
}: {
  category: (typeof categories)[number];
  selectedMenu: string;
  setSelectedMenu: (a: (typeof categories)[number]) => void;
}) {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        setSelectedMenu(category);
      }}
      className={cn(
        "w-full justify-start rounded-md border border-gray-secondary py-5 text-left",
        category == selectedMenu &&
          "bg-neutral-100 dark:bg-black dark:hover:bg-black",
      )}
    >
      <h4>{category}</h4>
    </Button>
  );
}
