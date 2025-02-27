import SearchBar from "../../../components/searchBar";
import {
  AccountCircle,
  LoginRounded,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { getGenres } from "@/api/genre";
import { TGenre } from "@/types/genre";
import { useQuery } from "@tanstack/react-query";
import { ArchivrIcon } from "@/components/archivrIcon";
import { useSettings } from "@/context/settings";

export default function Header() {
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
    select: (data) => data as unknown as TGenre[],
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Return the header component
  return (
    <header className="sticky left-0 top-0 z-50 flex h-auto w-full flex-row items-center justify-between bg-black px-6 py-3 outline outline-gray-secondary/50">
      <Link
        to="/"
        className="flex h-full flex-row items-center justify-start gap-3 text-white transition-colors hover:text-purple"
      >
        <ArchivrIcon sx={{ fontSize: "2.25rem" }} />
        <h3 className="font-bold"> Archivr </h3>
      </Link>

      <div className="flex h-full flex-row items-center justify-end gap-6">
        <div className="hidden flex-row items-center justify-center gap-6 md:flex">
          <Link
            to="/"
            className="text-white transition-colors hover:text-purple"
          >
            Home
          </Link>
          <Dropdown>
            <DropdownTrigger className="flex flex-row items-center justify-center gap-1 text-base text-white transition-colors hover:text-purple">
              Genre
              <KeyboardArrowDownRounded sx={{ fontSize: "1.5rem" }} />
            </DropdownTrigger>
            <DropdownContent className="grid grid-cols-5 gap-2 bg-black p-2">
              {isGenresLoading && <DropdownItem>Loading...</DropdownItem>}
              {genresError && <DropdownItem>Error loading genres</DropdownItem>}
              {genres?.map((genre) => (
                <DropdownItem
                  key={genre.slug}
                  onSelect={() => navigate(`/genre/${genre.slug}`)}
                >
                  {genre.genre}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
          <Link
            to="/trending"
            className="text-white transition-colors hover:text-purple"
          >
            Trending
          </Link>
          <Link
            to="/popular"
            className="text-white transition-colors hover:text-purple"
          >
            Popular
          </Link>
          <Link
            to="/members"
            className="text-white transition-colors hover:text-purple"
          >
            Members
          </Link>
        </div>
        <div className="flex flex-row items-center justify-center gap-6">
          <SearchBar />
          {user ? (
            <Dropdown>
              <DropdownTrigger className="flex flex-row items-center gap-3 text-white transition-colors hover:text-purple">
                <img src={import.meta.env.VITE_API_URL+"/user/pfp/"+user.id} className="size-[2.5rem] rounded-[2.5rem]"></img>
                <div className="flex flex-row items-center gap-1">
                  <div className="flex flex-col items-start">
                    <h4 className="text-nowrap">{
                      settings?.display_name
                      ?
                      settings?.display_name
                      :
                      user.username
                    }</h4>
                    <h5 className="text-nowrap text-[#7F7F7E]">{"@"+user.username}</h5>
                  </div>
                  <KeyboardArrowDownRounded sx={{ fontSize: "1.5rem" }} />
                </div>
              </DropdownTrigger>
              <DropdownContent>
                {user.role === "admin" && (
                  <DropdownItem onSelect={() => navigate("/admin")}>
                    Admin Portal{" { }"}
                  </DropdownItem>
                )}
                <DropdownItem onSelect={() => navigate("/profile/"+user.id)}>
                  Profile
                </DropdownItem>
                <DropdownItem onSelect={() => navigate("/settings")}>
                  Settings
                </DropdownItem>
                <DropdownItem onSelect={handleLogout}>Logout</DropdownItem>
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
      </div>
    </header>
  );
}
