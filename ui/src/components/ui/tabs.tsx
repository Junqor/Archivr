import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const TabTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
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
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("tab-list flex self-stretch", className)}
    {...props}
  />
));
TabList.displayName = "TabList";

const TabContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("tab-content data-[state=active]:pt-5", className)}
    {...props}
  />
));
TabContent.displayName = "TabContent";

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn("tabs-container flex w-full flex-col items-start", className)}
    {...props}
  />
));
Tabs.displayName = "TabsContainer";

export { Tabs, TabTrigger, TabList, TabContent };
