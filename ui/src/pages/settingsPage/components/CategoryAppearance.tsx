import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { ChevronDown } from "lucide-react";
import { TUserSettings } from "../settingsPage";

export function ProfileSettingsCategoryAppearance({
  updateSetting,
  settings,
}: {
  updateSetting: (key: keyof TUserSettings, value: string) => void;
  settings: TUserSettings;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 self-stretch">
      <div className="flex items-start gap-2 self-stretch">
        <div className="flex flex-1 flex-col items-start justify-center gap-2 self-stretch">
          <h4>Theme</h4>
          <Dropdown>
            <DropdownTrigger>
              <div className="flex min-h-9 min-w-[295px] items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2">
                <p className="text-base font-medium capitalize leading-normal">
                  {settings.theme || ""}
                </p>
                <ChevronDown></ChevronDown>
              </div>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem
                onSelect={() => {
                  updateSetting("theme", "dark");
                }}
              >
                Dark
              </DropdownItem>
              <DropdownItem
                onSelect={() => {
                  updateSetting("theme", "light");
                }}
              >
                Light
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-2 self-stretch">
          <h4>Font</h4>
          <Dropdown>
            <DropdownTrigger>
              <div className="flex min-h-9 min-w-[295px] items-start gap-3 self-stretch rounded-xl border border-white bg-black px-4 py-2">
                <p className="text-base font-medium capitalize leading-normal">
                  {settings.font_size || ""}
                </p>
                <ChevronDown></ChevronDown>
              </div>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem
                onSelect={() => {
                  updateSetting("font_size", "small");
                }}
              >
                Small
              </DropdownItem>
              <DropdownItem
                onSelect={() => {
                  updateSetting("font_size", "normal");
                }}
              >
                Normal
              </DropdownItem>
              <DropdownItem
                onSelect={() => {
                  updateSetting("font_size", "large");
                }}
              >
                Large
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
