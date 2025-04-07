import { useTheme } from "@/context/theme";
import { THEME } from "@/types/theme";
import { DarkMode, LightMode } from "@mui/icons-material";

export function ThemeSwitch(){
    const {theme, setTheme} = useTheme()

    function onClick() {
        if (theme == THEME.DARK) {
            setTheme(THEME.LIGHT);
        }
        else{
            setTheme(THEME.DARK);
        }
    }

    return (
        <div onClick={onClick} className={"flex items-center transition-transform px-[.125rem] w-[3.236rem] h-[2rem] rounded-full outline outline-1 dark:outline-white/5 outline-black/50 cursor-pointer shadow-inner shadow-black/50 dark:shadow-black/100 bg-white dark:bg-white/15"+
            (theme == THEME.DARK ? " pl-[1.361rem]" : "")
        }>
            <div className="flex items-center justify-center w-[1.75rem] h-[1.75rem] bg-white dark:bg-black/0 rounded-full shadow-sm shadow-black/50 dark:shadow-black/100">
                {
                theme == THEME.DARK ?
                    <DarkMode sx={{color:"#ffffff"}}/>
                :
                    <LightMode sx={{color:"#c9c600"}}/>
                }
            </div>
        </div>
    );
}