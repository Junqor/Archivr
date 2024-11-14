import Logo from "@/assets/logo.svg";
import SearchBar from "./searchBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth";

export default function Header() {
  const { logout } = useAuth();

  // Return the header component
  return (
    <header className="sticky top-0 left-0 flex flex-row w-full h-auto px-6 py-3 bg-black justify-between items-center z-50">
      <div className="flex flex-row items-center justify-start h-full gap-3">
        <img src={Logo} className="size-[35px]" />
        <h3 className="font-bold"> Archivr </h3>
      </div>
      <div className="flex flex-row items-center justify-end h-full gap-11">
        <div className="flex flex-row items-center justify-center gap-6">
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
        </div>
        <div className="flex flex-row items-center justify-center gap-6">
          <SearchBar />
          {/*
            If the user is logged in, display the logout button
            Otherwise, display the login button
          */}
          {localStorage.getItem("auth") === "true" ? (
            <button
              className="text-white transition-colors hover:text-purple flex flex-row items-center gap-2"
              onClick={logout}
            >
              <AccountCircleIcon />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-white transition-colors hover:text-purple flex flex-row items-center gap-2"
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
