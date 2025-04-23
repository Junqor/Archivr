import { ThemeSwitch } from "@/components/theme-switch";
import { UserAvatar } from "@/components/ui/avatar";
import { BurgerIcon } from "@/components/ui/burger-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth";
import { useSettings } from "@/context/settings";
import { cn } from "@/lib/utils";
import {
  Flame,
  House,
  LibraryBig,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  UserSearch,
} from "lucide-react";
import { forwardRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const MobileNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const handleLogoout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };
  return (
    <div
      className={cn("flex flex-row items-center gap-x-3", className)}
      {...props}
    >
      {user ? (
        <Link to={`/profile/${user.username}`}>
          <UserAvatar user={{ ...user, avatar_url: settings?.avatar_url }} />
        </Link>
      ) : (
        <Link
          to="/login"
          className="text-white transition-colors hover:text-purple"
        >
          Sign In
        </Link>
      )}

      <NavLink to="/search" onClick={() => setIsOpen(false)}>
        <Search />
      </NavLink>

      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <BurgerIcon open={isOpen} />
      </Button>
      <div
        className={cn(
          isOpen ? "block opacity-100" : "pointer-events-none block opacity-0",
          "flex flex-col items-center justify-center gap-4 dark:bg-black/95 bg-white/90 pb-40",
          "fixed left-0 top-16 z-0 h-dvh w-dvw transition-opacity duration-300",
        )}
      >
        <div className="flex flex-col items-start justify-center gap-4">
          <div className="w-full">
            <h2> Explore </h2>
            <Separator className="bg-none" />
          </div>
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            <House /> Home
          </NavLink>
          <NavLink to="/search" onClick={() => setIsOpen(false)}>
            <Search /> Search
          </NavLink>
          <NavLink to="/genre" onClick={() => setIsOpen(false)}>
            <LibraryBig /> Genres
          </NavLink>
          <NavLink to="/trending" onClick={() => setIsOpen(false)}>
            <TrendingUp /> Trending
          </NavLink>
          <NavLink to="/popular" onClick={() => setIsOpen(false)}>
            <Sparkles /> Popular
          </NavLink>
          <NavLink to="/activity" onClick={() => setIsOpen(false)}>
            <Flame /> Activity
          </NavLink>
          <NavLink to="/members" onClick={() => setIsOpen(false)}>
            <UserSearch /> Members
          </NavLink>
          <ThemeSwitch/>
          {user && (
            <>
              <div className="w-full items-center">
                <h2> Account </h2>
                <Separator className="bg-none" />
              </div>
              <NavLink to="/settings" onClick={() => setIsOpen(false)}>
                <Settings /> Settings
              </NavLink>
              <Button
                className="w-full p-4 py-5 text-2xl font-bold"
                onClick={handleLogoout}
              >
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const NavLink = forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, children, ...props }, ref) => {
  return (
    <Link
      className={cn(
        "inline-flex items-center gap-x-4 text-xl font-bold transition-colors hover:text-purple",
        className,
      )}
      {...props}
      ref={ref}
    >
      {children}
    </Link>
  );
});
