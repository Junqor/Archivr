import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown"
import { ChevronDown } from "lucide-react"

export function ProfileSettingsCategoryAppearance({updateSetting, findSetting}:{updateSetting:(key:string,value:string)=>void,findSetting:(key:string)=>(string)}){
    return (
        <div className="flex flex-col gap-2 self-stretch flex-1">
            <div className="flex gap-2 items-start self-stretch">
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <h4>
                        Theme
                    </h4>
                    <Dropdown>
                        <DropdownTrigger>
                            <div className="flex py-2 px-4 min-h-9 min-w-[295px] items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                                <p className="capitalize text-base font-medium leading-normal">
                                    {findSetting("theme")}
                                </p>
                                <ChevronDown></ChevronDown>
                            </div>
                        </DropdownTrigger>
                    <DropdownContent>
                        <DropdownItem onSelect={()=>{updateSetting("theme","dark")}}>
                            Dark
                        </DropdownItem>
                        <DropdownItem onSelect={()=>{updateSetting("theme","light")}}>
                            Light
                        </DropdownItem>
                    </DropdownContent>
                    </Dropdown>
                </div>
                <div className="flex flex-col justify-center items-start gap-2 self-stretch flex-1">
                    <h4>
                        Font
                    </h4>
                    <Dropdown>
                        <DropdownTrigger>
                            <div className="flex py-2 px-4 min-h-9 min-w-[295px] items-start gap-3 self-stretch rounded-xl border border-white bg-black">
                                <p className="capitalize text-base font-medium leading-normal">
                                    {findSetting("font_size")}
                                </p>
                                <ChevronDown></ChevronDown>
                            </div>
                        </DropdownTrigger>
                    <DropdownContent>
                        <DropdownItem onSelect={()=>{updateSetting("font_size","small")}}>
                            Small
                        </DropdownItem>
                        <DropdownItem onSelect={()=>{updateSetting("font_size","normal")}}>
                            Normal
                        </DropdownItem>
                        <DropdownItem onSelect={()=>{updateSetting("font_size","large")}}>
                            Large
                        </DropdownItem>
                    </DropdownContent>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}