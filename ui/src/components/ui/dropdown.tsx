import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const Dropdown = DropdownMenuPrimitive.Root;

const DropdownTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> & {
    indicator?: boolean;
  }
>(({ className, children, indicator, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      "gap-x-1 text-base text-white transition-colors hover:text-purple",
      "group inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    {indicator && (
      <ChevronDown
        className="top-px size-4 transition-transform duration-300 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    )}
  </DropdownMenuPrimitive.Trigger>
));
DropdownTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 5, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] rounded-md border border-neutral-200 bg-black p-1 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "text-sm",
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 outline-none focus:bg-purple focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-purple dark:focus:text-white",
      className,
    )}
    {...props}
  />
));
DropdownItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("my-1 h-px bg-neutral-200 dark:bg-neutral-800", className)}
    {...props}
  />
));
DropdownSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-neutral-900 dark:text-neutral-50",
      className,
    )}
    {...props}
  />
));
DropdownLabel.displayName = DropdownMenuPrimitive.Label.displayName;

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
};
