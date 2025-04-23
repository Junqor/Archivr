import { ArchivrIcon } from "@/components/archivrIcon"
import { useTheme } from "@/context/theme";
import { THEME } from "@/types/theme";
import { useRef, useState } from "react";
import { Link } from "react-router-dom"

const anims:Array<string> = [
    `
    svg.logo-animate {
        animation-name: icon-animate;
        animation-duration: 0.5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    h3.logo-animate {
        animation-name: text-animate;
        animation-duration: 0.5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    @keyframes icon-animate {
        0% {translate: 0 0.6rem; scale: 1.25 0.75}
        5% {translate: 0 0.5rem; scale: 1.25 0.75}
        25% {translate: 0 -0.5rem; scale: 1 1}
        50% {translate: 0 -0.75rem; scale: 1 1}
        75% {translate: 0 -0.5rem; scale: 1 1}
        95% {translate: 0 0.5rem; scale: 1.25 0.75}
        100% {translate: 0 0.4rem; scale: 1.25 0.75}
    }
    @keyframes text-animate {
        0% {translate: 0 0.1rem}
        5% {translate: 0 0}
        95% {translate: 0 0}
        100% {translate: 0 -0.1rem}
    }
    `,
    `
    .logo-animate {
        overflow: hidden;
    }
    svg.logo-animate {
        animation-name: icon-animate;
        animation-duration: 0.2s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    h3.logo-animate {
        animation-name: text-animate;
        animation-duration: 1.0s;
        animation-iteration-count: infinite;
        animation-timing-function: ease;
    }
    @keyframes icon-animate {
        0% {translate: 0 -2.25rem; scale: 1 1}
        100% {translate: 0 2.25rem; scale: 0.75 1.25}
    }
    @keyframes text-animate {
        0% {translate: 0 0.3rem}
        50% {translate: 0 -0.3rem}
        100% {translate: 0 0.3rem}
    }
    `,
    `
    svg.logo-animate {
        animation-name: icon-animate;
        animation-duration: 0.3s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    h3.logo-animate {
        animation-name: text-animate;
        animation-duration: 0.1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    @keyframes icon-animate {
        0% {rotate: 0deg; scale: 1.5 0.5}
        25% {rotate: 90deg; scale: 0.5 1.5}
        50% {rotate: 180deg; scale: 1.5 0.5}
        75% {rotate: 270deg; scale: 0.5 1.5}
        100% {rotate: 360deg; scale: 1.5 0.5}
    }
    @keyframes text-animate {
        0% {translate: 0.2rem 0rem}
        25% {translate: 0rem 0.2rem}
        50% {translate: 0rem -0.2rem}
        75% {translate: -0.2rem 0.0rem}
        100% {translate: 0.2rem 0rem}
    }
    `,
    `
    svg.logo-animate {
        animation-name: icon-animate;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: ease;
    }
    h3.logo-animate {
        animation-name: text-animate;
        animation-duration: 0.5s;
        animation-iteration-count: infinite;
        animation-timing-function: ease;
    }
    @keyframes icon-animate {
        0% {rotate: 0deg; scale: 0.75 0.75}
        25% {rotate: 0deg; scale: 1.25 1.25}
        50% {rotate: 180deg; scale: 0.75 0.75}
        75% {rotate: 180deg; scale: 1.25 1.25}
        100% {rotate: 360deg; scale: 0.75 0.75}
    }
    @keyframes text-animate {
        0% {scale: 1.25 1.25}
        50% {scale: 0.75 0.75}
        100% {scale: 1.25 1.25}
    }
    `,
    `
    svg.logo-animate {
        animation-name: icon-animate;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
    }
    h3.logo-animate {
        animation-name: text-animate;
        animation-duration: 4s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        background: linear-gradient(90deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000);
        -webkit-background-clip: text;
        color: transparent;
        background-clip: text;
        background-size: 400% 100%;
        scale: 1.05 1.05;
    }
    @keyframes icon-animate {
        0% {translate: 0 0.5rem}
        50% {translate: 0 -0.5rem}
        100% {translate: 0 0.5rem}
    }
    @keyframes text-animate {
        0% {background-position: 400% 0}
        100% {background-position: 0% 0}
    }
    `,
    `
    svg.logo-animate.lightanim {
        color: #000000;
    }
    svg.logo-animate.darkanim {
        color: #FFFFFF;
    }
    svg.logo-animate {
        animation-name: icon-animate;
        animation-duration: 5s;
        animation-iteration-count: 1;
        animation-timing-function: linear;
        animation-fill-mode: forwards;  
    }
    h3.logo-animate {
        animation-name: text-animate;
        animation-duration: 5s;
        animation-iteration-count: 1;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
    }
    @keyframes icon-animate {
        0% {color: inherit}
        3% {color: #5616EC}
        6% {color: inherit}
        20% {color: inherit}
        22% {color: #5616EC}
        24% {color: inherit}
        26% {color: #5616EC}
        28% {color: inherit}
        40% {color: inherit}
        43% {color: #000000}
        48% {color: #FFFFFF}
        60% {color: #8646FF}
        70% {color: #5616EC}
        100% {color: #5616EC}
    }
    @keyframes text-animate {
        0% {color: inherit}
        3% {color: #5616EC}
        6% {color: inherit}
        20% {color: inherit}
        22% {color: #5616EC}
        24% {color: inherit}
        26% {color: #5616EC}
        28% {color: inherit}
        40% {color: inherit}
        43% {color: #000000}
        48% {color: #FFFFFF; text-shadow: 0px 0px 0px #5616EC}
        60% {color: #8646FF}
        70% {color: #5616EC}
        100% {color: #5616EC; text-shadow: 0px 0px 10px #5616EC}
    }
    `,
]

const debug = false;

export function ArchivrLogo(){
    const { theme } = useTheme();
    const [hover,setHover] = useState<boolean>(false);
    const anim = useRef<number>(0);

    return (
        <>
        <style children={debug ? anims[anims.length-1] : anims[anim.current]}/>
        <Link
            onMouseEnter={()=>{anim.current = Math.floor(Math.random()*anims.length-0.01);setHover(true)}}
            onMouseLeave={()=>setHover(false)}
            to="/"
            className="flex logo-animate h-full flex-row items-center justify-start gap-3 dark:text-white text-black transition-colors hover:text-purple dark:hover:text-purple"
        >
            <ArchivrIcon className={(theme == THEME.DARK ? "darkanim " : "lightanim ")+(hover?"logo-animate":"")} sx={{ fontSize: "2.25rem" }}/>
            <h3 className={"font-bold "+(theme == THEME.DARK ? "darkanim " : "lightanim ")+(hover?"logo-animate":"")}> Archivr </h3>
        </Link>
        </>
    );
}