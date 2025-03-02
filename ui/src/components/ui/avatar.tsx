import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { SecurityTwoTone } from "@mui/icons-material";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full border border-white bg-white capitalize text-black",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const UserAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    user: {
      username: string;
      avatar_url: string | null;
      role?: "admin" | "user";
    };
  } & {
    size?: "small";
  }
>(({ user, size, className, ...props }, ref) => (
  <div className="relative">
    <Avatar
      ref={ref}
      className={cn(size === "small" && "size-6 text-xs", className)}
      {...props}
    >
      <AvatarImage src={user.avatar_url || undefined} />
      <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
    </Avatar>
    {user.role === "admin" && (
      <SecurityTwoTone
        className={cn(
          size === "small"
            ? "-bottom-1 -right-1"
            : "-bottom-[0.5px] -right-[0.5px]",
          "absolute",
        )}
        sx={{
          fontSize: size === "small" ? "0.8rem" : "1rem",
          color: "#5616EC",
        }}
      />
    )}
  </div>
));

export { Avatar, AvatarImage, AvatarFallback, UserAvatar };
