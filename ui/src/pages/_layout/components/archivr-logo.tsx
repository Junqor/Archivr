import { ArchivrIcon } from "@/components/archivrIcon"
import { useState } from "react";
import { Link } from "react-router-dom"


export function ArchivrLogo(){
    const [hover,setHover] = useState<boolean>(false);

    return (
        <>
        <style children="
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
        "/>
        <Link
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            to="/"
            className="flex h-full flex-row items-center justify-start gap-3 dark:text-white text-black transition-colors hover:text-purple dark:hover:text-purple"
        >
            <ArchivrIcon className={hover?"logo-animate":""} sx={{ fontSize: "2.25rem" }}/>
            <h3 className={"font-bold "+(hover?"logo-animate":"")}> Archivr </h3>
        </Link>
        </>
    );
}