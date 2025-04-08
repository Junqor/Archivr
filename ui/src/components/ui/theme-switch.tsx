import { useTheme } from "@/context/theme";
import { THEME } from "@/types/theme";
import { DarkMode, LightMode, Stars } from "@mui/icons-material";
import { Badge } from "./badge";

const styleLeft = {
    animationName: "to-left",
    animationDuration: "0.5s",
    animationIterationCount: "1",    
}

const styleRight = {
    animationName: "to-right",
    animationDuration: "0.5s",
    animationIterationCount: "1",
    paddingLeft: "1.361rem",
}

const styleAppear = {
    animationName: "appear",
    animationDuration: "0.5s",
    animationIterationCount: "1",
}

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
        <>
        <style children="
            @keyframes to-right {
                0% {padding-left: 0.125rem;}
                100% {padding-left: 1.361rem;}
            }
            @keyframes to-left {
                0% {padding-left: 1.361rem;}
                100% {padding-left: 0.125rem;}
            }
            @keyframes appear {
                0% {scale: 0 0;}
                50% {scale: 1.2 1.2;}
                100% {scale: 1 1;}
            }
        "/>
        {theme==THEME.LIGHT?<span style={styleAppear} className="text-green-500"><Stars></Stars><b>New!</b> Light Mode <Badge className="bg-green-500">BETA</Badge></span>:null}
        <div onClick={onClick} style={theme==THEME.DARK?styleRight:styleLeft} className={"flex items-center transition-transform px-[.125rem] w-[3.236rem] h-[2rem] rounded-full outline outline-1 dark:outline-white/5 outline-black/50 cursor-pointer shadow-inner shadow-black/50 dark:shadow-black/100 bg-white dark:bg-white/15"}>
            <div className="flex items-center justify-center w-[1.75rem] h-[1.75rem] bg-white dark:bg-black/0 rounded-full shadow-sm shadow-black/50 dark:shadow-black/100">
                {
                theme == THEME.DARK ?
                    <DarkMode sx={{color:"#ffffff"}}/>
                :
                    <LightMode sx={{color:"#c9c600"}}/>
                }
            </div>
        </div>
        </>
    );
}