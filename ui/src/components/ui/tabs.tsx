import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const TabTrigger = React.forwardRef<
  React.ElementRef<typeof Tabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof Tabs.Trigger>
>(({ className, ...props }, ref) => (
  <Tabs.Trigger
    ref={ref}
    className={cn(
      "tab-trigger flex items-center justify-center self-stretch px-2 text-[1.2rem] font-medium hover:underline",
      className,
    )}
    {...props}
  />
));
TabTrigger.displayName = "TabTrigger";

const TabList = React.forwardRef<
  React.ElementRef<typeof Tabs.List>,
  React.ComponentPropsWithoutRef<typeof Tabs.List>
>(({ className, ...props }, ref) => (
  <Tabs.List
    ref={ref}
    className={cn("tab-list flex self-stretch", className)}
    {...props}
  />
));
TabList.displayName = "TabList";

const TabContent = React.forwardRef<
  React.ElementRef<typeof Tabs.Content>,
  React.ComponentPropsWithoutRef<typeof Tabs.Content>
>(({ className, ...props }, ref) => (
  <Tabs.Content ref={ref} className={cn("tab-content", className)} {...props} />
));
TabContent.displayName = "TabContent";

const TabsContainer = React.forwardRef<
  React.ElementRef<typeof Tabs.Root>,
  React.ComponentPropsWithoutRef<typeof Tabs.Root>
>(({ className, ...props }, ref) => (
  <Tabs.Root
    ref={ref}
    className={cn("tabs-container flex w-full flex-col items-start", className)}
    {...props}
  />
));
TabsContainer.displayName = "TabsContainer";

export { TabsContainer, TabTrigger, TabList, TabContent };
