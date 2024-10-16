import { Button } from "./ui/button";

export const Header = () => {
  return (
    <div className="flex flex-row w-full h-full bg-black max-h-16">
      <div className="flex-row hidden w-full h-full md:flex">
        <div className="flex flex-row w-1/4 h-full">
          <div className="flex flex-row items-center justify-start w-full h-full bg-black">
            <img
              src="src/assets/penguin.png"
              alt="archivr logo"
              className="p-1 size-10"
            />
            <h2 className="text-2xl inter-bold"> Archiver </h2>
          </div>
        </div>
        <div className="flex-row hidden w-3/4 h-full md:flex">
          <div className="flex flex-row items-center justify-end w-full h-full bg-black">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Genre</Button>
            <Button variant="ghost">Country</Button>
            <Button variant="ghost">Trending</Button>
            <Button variant="ghost">Popular</Button>
            <Button variant="ghost">Member</Button>
          </div>
        </div>
        <div className="flex-row items-center justify-end hidden w-1/4 h-full mr-3 bg-black md:flex">
          <Button variant="ghost" className="flex flex-row items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="mr-3"
            >
              <path d="M18 20a6 6 0 0 0-12 0" />
              <circle cx="12" cy="10" r="4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <p>Sign in</p>
          </Button>
        </div>
      </div>
    </div>
  );
};
