import SearchBar from "../../../components/searchBar";
import { LoginRounded, KeyboardArrowDownRounded } from "@mui/icons-material";
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
import { UserAvatar } from "@/components/ui/avatar";
import { is_user_banned, TUserBanData } from "@/api/moderation";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
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

  // fetch ban status
  const {data: banned} = useQuery<TUserBanData | undefined>({
    queryKey: ["headerIsUserBanned", user?.id],
    queryFn: async () => {
      if (!user){
        return undefined;
      }
      const data = await is_user_banned(user.id);
      return data as TUserBanData;
    },
  })

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Return the header component
  return (
    <header className="sticky outline left-0 top-0 z-50 outline-gray-secondary/50">
      <header className="flex h-auto w-full flex-row items-center justify-between bg-black px-6 py-3">
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
            <Dropdown modal={false}>
              <DropdownTrigger className="flex flex-row items-center justify-center gap-1 text-base text-white transition-colors hover:text-purple">
                Genres
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

            <Dropdown modal={false}>
              <DropdownTrigger className="flex flex-row items-center gap-3 text-base text-white transition-colors hover:text-purple">
                Explore
                <KeyboardArrowDownRounded sx={{ fontSize: "1.5rem" }} />
              </DropdownTrigger>
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
              <Dropdown>
                <DropdownTrigger className="flex flex-row items-center gap-3 text-white transition-colors hover:text-purple">
                  <UserAvatar user={user} />
                  <div className="flex flex-row items-center gap-1">
                    <div className="flex flex-col items-start">
                      <h4 className="text-nowrap">
                        {user.displayName || user.username}
                      </h4>
                      <h5 className="text-nowrap text-[#7F7F7E]">
                        {"@" + user.username}
                      </h5>
                    </div>
                    <KeyboardArrowDownRounded sx={{ fontSize: "1.5rem" }} />
                  </div>
                </DropdownTrigger>
                <DropdownContent>
                  {user.role === "admin" && (
                    <DropdownItem asChild>
                      <Link to="/admin">Admin Portal{" { }"}</Link>
                    </DropdownItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownItem asChild>
                      <Link to="/mod">Mod Portal{" { }"}</Link>
                    </DropdownItem>
                  )}
                  <DropdownItem asChild>
                    <Link to={`/profile/${user.username}`}>Profile</Link>
                  </DropdownItem>
                  <DropdownItem asChild>
                    <Link to="/settings">Settings</Link>
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
      {
      // BANner
      banned?.is_banned
      ?
      <div className="bg-gradient-to-tr from-red-900 via-red-600 to-orange-600">
        <div className="flex flex-col items-center justify-center p-3">
          <p className="text-4xl font-extrabold">Hey, IDIOT! You've been BANNED!</p>
          <p className="text-xl font-light">Reason: {banned.message ? '"'+banned.message+'"' : "WHO CARES"}</p>
          <p className="text-2xl font-bold">You can wreak more havok in</p>
          <p className="text-4xl font-bold">{banned.expiry_date ? <BanTimer unban_time={new Date(banned.expiry_date)}/> : "NEVER"}</p>
        </div>
      </div>
      :
      null
      }  
    </header>
  );
}

function BanTimer({unban_time}:{unban_time: Date}){
  const [time, setTime] = useState<string>("XX:XX:XX");

  useEffect(()=>{
    const interval = setInterval(() => {
      const diff = (unban_time.getTime() - Date.now());
      const date = new Date(0);
      date.setMilliseconds(diff);
      const days = Math.floor(diff/86400000);
      setTime(days+":"+date.toISOString().slice(11, 23));
    }, 20);

    return () => clearInterval(interval);
  });

  return (
    <span>
      {time}
    </span>
  );
}
