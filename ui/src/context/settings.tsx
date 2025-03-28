import { getUserSettingsForSettingsContext } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { useContext, createContext } from "react";
import { useAuth } from "./auth";

export type TUserSettingsContext = {
  settings: TUserSettingsContextSettings | null;
  refetchSettings: () => void;
};

export type TUserSettingsContextSettings = {
  display_name: string;
  avatar_url: string;
  show_adult_content: boolean;
  theme: string;
  font_size: string;
  grant_personal_data: boolean;
  show_personalized_content: boolean;
};

const SettingsContext = createContext<TUserSettingsContext | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const { data: currentSettings, refetch: refetchSettingsContext } = useQuery({
    queryKey: ["settingsCurrentContextSettings", user ? user.id : null],
    queryFn: async () => {
      const userSettings = await getUserSettingsForSettingsContext();
      if (userSettings) {
        document.body.classList.remove("light");
        document.body.classList.remove("dark");
        document.body.classList.add(userSettings.theme);
        return userSettings;
      } else {
        return null;
      }
    },
    enabled: !!user,
  });

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        refetchSettings: refetchSettingsContext,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside a SettingsProvider");
  }
  return context;
}
