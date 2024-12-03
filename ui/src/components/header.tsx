import Logo from "@/assets/logo.svg";
import SearchBar from "./searchBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth";

export default function Header() {
  const { user, removeLoginDataFromLocalStorage } = useAuth();

  // Return the header component
  return (
    <header className="sticky top-0 left-0 z-50 flex flex-row items-center justify-between w-full h-auto px-6 py-3 bg-black">
      <div className="flex flex-row items-center justify-start h-full gap-3">
        <img src={Logo} className="size-[35px]" />
        <h3 className="font-bold"> Archivr </h3>
      </div>
      <div className="flex flex-row items-center justify-end h-full gap-11">
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
            to="/country"
            className="text-white transition-colors hover:text-purple"
          >
            Country
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
          {user && user.role === "admin" && (
            // ! Temporary, will be removed and put in a dropdown from profile icon
            <Link
              to="/admin"
              className="text-white transition-colors hover:text-purple"
            >
              Admin Portal
            </Link>
          )}
        </div>
        <div className="flex flex-row items-center justify-center gap-6">
          <SearchBar />
          {localStorage.getItem("auth") === "true" ? (
            <button
              className="flex flex-row items-center gap-2 text-white transition-colors hover:text-purple"
              onClick={removeLoginDataFromLocalStorage}
            >
              <AccountCircleIcon />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex flex-row items-center gap-2 text-white transition-colors hover:text-purple"
            >
              <AccountCircleIcon />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
