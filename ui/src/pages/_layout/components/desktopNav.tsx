import { getGenres } from "@/api/genre";
import SearchBar from "@/components/searchBar";
import { UserAvatar } from "@/components/ui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import { useAuth } from "@/context/auth";
import { useSettings } from "@/context/settings";
import { cn } from "@/lib/utils";
import { LoginRounded, SecurityOutlined } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

export const DesktopNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  // Fetch genres
  const {
    data: genres,
    isLoading: isGenresLoading,
    error: genresError,
  } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    select: (data) => data,
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className={cn(
        "flex h-full flex-row items-center justify-end gap-6",
        className,
      )}
      {...props}
    >
      <div className="flex flex-row items-center justify-center gap-6">
        <Link
          to="/"
          className="font-medium text-white transition-colors hover:text-purple"
        >
          Home
        </Link>
        <Dropdown modal={false}>
          <DropdownTrigger indicator>Genres</DropdownTrigger>
          <DropdownContent>
            <div className="grid grid-cols-5 gap-2 p-2">
              {isGenresLoading && <DropdownItem>Loading...</DropdownItem>}
              {genresError && <DropdownItem>Error loading genres</DropdownItem>}
              {genres?.map((genre) => (
                <DropdownItem asChild key={genre.slug}>
                  <Link to={`/genre/${genre.slug}`}>{genre.genre}</Link>
                </DropdownItem>
              ))}
            </div>
          </DropdownContent>
        </Dropdown>

        <Dropdown modal={false}>
          <DropdownTrigger indicator>Explore</DropdownTrigger>
          <DropdownContent>
            <DropdownItem asChild>
              <Link
                to="/trending"
                className="text-white transition-colors hover:text-purple"
              >
                Trending
              </Link>
            </DropdownItem>
            <DropdownItem asChild>
              <Link
                to="/popular"
                className="text-white transition-colors hover:text-purple"
              >
                Popular
              </Link>
            </DropdownItem>
            <DropdownItem asChild>
              <Link
                to="/activity"
                className="text-white transition-colors hover:text-purple"
              >
                Activity
              </Link>
            </DropdownItem>
            <DropdownItem asChild>
              <Link
                to="/members"
                className="text-white transition-colors hover:text-purple"
              >
                Members
              </Link>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-6">
        <SearchBar />
        {user ? (
          <Dropdown modal={false}>
            <DropdownTrigger
              className="flex flex-row items-center gap-3 text-white transition-colors hover:text-purple"
              indicator
            >
              <UserAvatar
                user={{ ...user, avatar_url: settings?.avatar_url }}
              />
              <div className="flex flex-row items-center gap-1">
                <div className="flex flex-col items-start">
                  <h4 className="text-nowrap">
                    {settings?.display_name || user.username}
                  </h4>
                  <h5 className="text-nowrap text-[#7F7F7E]">
                    {"@" + user.username}
                  </h5>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem asChild>
                <Link to={`/profile/${user.username}`}>Profile</Link>
              </DropdownItem>
              <DropdownItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownItem>
              <DropdownItem onSelect={handleLogout}>Logout</DropdownItem>
              {user.role === "admin" && (
                <>
                <DropdownSeparator/>
                <DropdownItem asChild>
                  <Link to="/admin">
                    <SecurityOutlined sx={{fontSize: "1.25rem",}}/>
                    Admin Panel
                  </Link>
                </DropdownItem>
                <DropdownItem asChild>
                  <Link to="/mod">
                    <SecurityOutlined sx={{fontSize: "1.25rem",}}/>
                    Mod Panel
                  </Link>
                </DropdownItem>
                </>
              )}
            </DropdownContent>
          </Dropdown>
        ) : (
          <Link
            to="/login"
            className="flex flex-row items-center gap-2 text-white transition-colors hover:text-purple"
          >
            <LoginRounded sx={{ fontSize: "1.5rem" }} />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
