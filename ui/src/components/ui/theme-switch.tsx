import { useSettings } from "@/context/settings";
import { DarkMode, LightMode } from "@mui/icons-material";

export function ThemeSwitch(){
    const {settings} = useSettings();
    const dark = settings?.theme == "dark";

    return (
        <div className={"flex items-center transition-transform px-[.125rem] w-[3.236rem] h-[2rem] rounded-full outline outline-1 dark:outline-white/5 outline-black/50 cursor-pointer shadow-inner shadow-black/50 dark:shadow-black/100 bg-white dark:bg-white/15"+
            (dark ? " pl-[1.361rem]" : "")
        }>
            <div className="flex items-center justify-center w-[1.75rem] h-[1.75rem] bg-white dark:bg-black/0 rounded-full shadow-sm shadow-black/50 dark:shadow-black/100">
                {
                dark ?
                    <DarkMode sx={{color:"#ffffff"}}/>
                :
                    <LightMode sx={{color:"#c9c600"}}/>
                }
            </div>
        </div>
    );
}