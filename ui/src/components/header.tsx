import Logo from "@/assets/logo.svg";
import SearchBar from "./searchBar";
import { Button } from "./ui/button";
import { LoginPopUp } from "./login";

export const Header = () => {
  return (
    <div className="sticky top-0 left-0 flex flex-row w-full h-full px-5 py-3 bg-black max-h-16">
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-row items-center justify-start h-full gap-3 mr-auto bg-black">
          <img src={Logo} className="size-[35px]" />
          <h3 className="font-bold"> Archivr </h3>
        </div>
        <div className="flex-row items-center justify-end hidden h-full bg-black md:flex">
          <Button variant="ghost" className="">
            Home
          </Button>
          <Button variant="ghost" className="">
            Genre
          </Button>
          <Button variant="ghost" className="">
            Country
          </Button>
          <Button variant="ghost" className="">
            Trending
          </Button>
          <Button variant="ghost" className="">
            Popular
          </Button>
          <Button variant="ghost" className="">
            Members
          </Button>
          <SearchBar />
          <LoginPopUp />
        </div>
      </div>
    </div>
  );
};
