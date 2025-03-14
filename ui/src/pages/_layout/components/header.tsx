import { Link } from "react-router-dom";
import { ArchivrIcon } from "@/components/archivrIcon";
import { DesktopNav } from "./desktopNav";
import { MobileNav } from "./mobileNav";

export default function Header() {
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

      <DesktopNav className="hidden md:flex" />
      <MobileNav className="flex md:hidden" />
    </header>
  );
}
