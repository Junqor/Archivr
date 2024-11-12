import Logo from "@/assets/logo.svg";
import SearchBar from "./searchBar";
import { Button } from "./ui/button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth";

export const Header = () => {
  const { logout } = useAuth();

  return (
    <div className="sticky top-0 left-0 flex flex-row w-full h-full px-5 py-3 bg-black max-h-16">
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-row items-center justify-start h-full gap-3 mr-auto bg-black">
          <img src={Logo} className="size-[35px]" />
          <h3 className="font-bold"> Archivr </h3>
        </div>
        <div className="flex-row items-center justify-end hidden h-full bg-black md:flex">
          <Button variant="ghost" className="" asChild>
            <Link to="/">Home</Link>
          </Button>

          <Button variant="ghost" className="">
            <Link to="/Genre">Genre</Link>
          </Button>
          <Button variant="ghost" className="">
            <Link to="/Country">Country</Link>
          </Button>
          <Button variant="ghost" className="">
            <Link to="/Trending">Trending</Link>
          </Button>
          <Button variant="ghost" className="">
            <Link to="/Popular">Popular</Link>
          </Button>
          <Button variant="ghost" className="">
            <Link to="/Members">Members</Link>
          </Button>
          <SearchBar />
          <Button onClick={logout} variant="ghost" className="flex flex-row">
            <AccountCircleIcon /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
