import { Link } from "react-router-dom";
import { ArchivrIcon } from "@/components/archivrIcon";
import { DesktopNav } from "./desktopNav";
import { MobileNav } from "./mobileNav";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth";
import { is_user_banned } from "@/api/moderation";
import { BANner } from "./ban-alert";

export default function Header() {
  const { user } = useAuth();

  // get banned data
  const { data: banData } = useQuery({
    queryKey: ["headerIsUserBanned"],
    queryFn: async () => {
      if (user) {
        const data = await is_user_banned(user.id);
        return data;
      }
      return null; // Changed to null to avoid browser warning
    },
  });

  return (
    <header className="sticky left-0 top-0 z-50 outline outline-gray-secondary/50">
      <header className="flex h-auto w-full flex-row items-center justify-between bg-black px-6 py-3">
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
      {banData && banData.is_banned ? <BANner banData={banData} /> : null}
    </header>
  );
}
