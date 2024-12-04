import SearchBar from "./searchBar";
import {
  AccountCircle,
  LoginRounded,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";
import { createSvgIcon } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";

export default function Header() {
  const { user, removeLoginDataFromLocalStorage } = useAuth();
  const navigate = useNavigate();

  // Return the header component
  return (
    <header className="sticky top-0 left-0 z-50 flex flex-row items-center justify-between w-full h-auto px-6 py-3 bg-black">
      <Link
        to="/"
        className="flex flex-row items-center justify-start h-full gap-3 text-white transition-colors hover:text-purple"
      >
        <ArchivrIcon sx={{ fontSize: "2.25rem" }} />
        <h3 className="font-bold"> Archivr </h3>
      </Link>

      <div className="flex flex-row items-center justify-end h-full gap-6">
        <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <Link
            to="/"
            className="text-white transition-colors hover:text-purple"
          >
            Home
          </Link>
          <Link
            to="/genre"
            className="text-white transition-colors hover:text-purple"
          >
            Genre
          </Link>
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
          {localStorage.getItem("auth") === "true" ? (
            <Dropdown>
              <DropdownTrigger className="flex flex-row items-center gap-3 text-white transition-colors hover:text-purple">
                <AccountCircle sx={{ fontSize: "1.5rem" }} />
                <div className="flex flex-row items-center gap-1">
                  <h4>{user ? user.username : "User"}</h4>
                  <KeyboardArrowDownRounded sx={{ fontSize: "1.5rem" }} />
                </div>
              </DropdownTrigger>
              <DropdownContent>
                {localStorage.getItem("auth") === "true" &&
                  user &&
                  user.role === "admin" && (
                    <DropdownItem onSelect={() => navigate("/admin")}>
                      Admin Portal{" { }"}
                    </DropdownItem>
                  )}
                <DropdownItem onSelect={() => navigate("/profile")}>
                  Profile
                </DropdownItem>
                <DropdownItem onSelect={() => navigate("/settings")}>
                  Settings
                </DropdownItem>
                <DropdownItem onSelect={removeLoginDataFromLocalStorage}>
                  Logout
                </DropdownItem>
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

const ArchivrIcon = createSvgIcon(
  <svg viewBox="0 0 86 80" fill="none">
    <g clipPath="url(#clip0_32_68)">
      <path
        d="M72.9846 42.8643C68.9902 37.1916 65.9357 31.4294 66.0364 23.9664C66.2378 10.3832 55.6308 -0.0447548 42.6406 4.66622e-07C29.6839 0.0447557 19.2895 10.4951 19.3902 24.1343C19.435 30.2657 17.4993 35.3343 14.2881 40.2573C10.372 46.2545 5.53846 51.4909 -0.0111885 56.7273C4.24056 57.242 7.61958 56.5594 10.7301 55.5748C14.1427 54.4895 14.4559 55.8434 14.5678 58.5287C14.7692 63.1385 16.3916 67.4238 19.5133 70.6797C22.1427 73.421 21.9636 75.2112 19.1217 77.214C18.2154 77.8518 17.2531 78.4 16.3133 78.9818C16.6042 79.3175 16.8951 79.6531 17.186 80H69.4042C67.4797 78.1986 66.2825 77.0462 65.0406 75.9273C63.8322 74.8308 63.0601 73.9133 64.593 72.3021C68.5874 68.1287 70.7804 63.0937 71.0042 57.2755C71.0825 55.351 71.6531 54.8587 73.7678 55.3734C77.3371 56.235 80.9958 57.3091 85.4378 56.6266C80.4476 52.0504 76.3972 47.7315 72.9622 42.8643H72.9846ZM42.5287 73.7455C25.8014 73.7007 17.779 63.0601 22.3552 46.8028C24.6825 38.5231 26.2154 30.221 26.0587 21.5385C25.8909 12.386 32.3133 8.11189 40.8839 11.4797C42.5399 12.1287 43.4797 11.8266 44.9119 11.2559C52.9678 8.06713 59.558 12.5091 59.4014 21.3818C59.2559 30.0531 60.7217 38.3664 63.0601 46.6462C67.7259 63.2168 59.6587 73.779 42.5287 73.7343V73.7455Z"
        fill="#F2F2F0"
      />
      <path
        d="M49.1413 31.7986C41.8238 37.5049 44.2517 38.4671 36.4979 31.7315C44.3077 25.5105 41.5888 25.9916 49.1413 31.7986Z"
        fill="#F2F2F0"
      />
      <path
        d="M32.6713 20.2741C32.7608 18.3385 33.779 17.0406 35.6028 16.828C37.7399 16.5818 39.2056 17.8126 39.3063 19.9496C39.407 22.0979 38.0755 23.4182 35.9049 23.3958C34.0028 23.3734 32.9958 22.0979 32.6713 20.2741Z"
        fill="#F2F2F0"
      />
      <path
        d="M52.8 20.1846C52.4643 22.2322 51.3119 23.5748 49.1413 23.3846C47.2951 23.228 46.0867 21.9748 46.1538 20.0727C46.2322 17.9245 47.5748 16.649 49.7454 16.8168C51.6028 16.9622 52.621 18.2378 52.8112 20.1846H52.8Z"
        fill="#F2F2F0"
      />
    </g>
    <defs>
      <clipPath id="clip0_32_68">
        <rect width="85.449" height="80" fill="white" />
      </clipPath>
    </defs>
  </svg>,
  "ArchivrIcon"
);
