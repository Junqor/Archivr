import { getUserSettingsForSettingsContext } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { useContext, createContext } from "react";

export type TUserSettingsContext = {
    settings: TUserSettingsContextSettings | null;
    refetchSettings: () => void;
}

export type TUserSettingsContextSettings = {
    display_name: string;
    show_adult_content: boolean;
    theme: string;
    font_size: string;
    grant_personal_data: boolean;
    show_personalized_content: boolean;
}

const SettingsContext = createContext<TUserSettingsContext | undefined>(undefined);

export function SettingsProvider({children}:{children: React.ReactNode}){
    const { data:currentSettings, refetch:refetchSettingsContext } = useQuery({
        queryKey: ['settingsCurrentContextSettings'],
        queryFn: async () => {
            const a = await getUserSettingsForSettingsContext();
            if (a) {
                return a;
            }
            else {
                return null;
            }
        }
    });

    return(
        <SettingsContext.Provider
            value = {{
                settings : currentSettings,
                refetchSettings: refetchSettingsContext,
            }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings(){
    const context = useContext(SettingsContext);
    if (!context){
        throw new Error("useSettings must be used inside a SettingsProvider");
    }
    return context
}