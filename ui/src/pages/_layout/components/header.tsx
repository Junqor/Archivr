import { DesktopNav } from "./desktopNav";
import { MobileNav } from "./mobileNav";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth";
import { is_user_banned } from "@/api/moderation";
import { BANner } from "./ban-alert";
import { ArchivrLogo } from "./archivr-logo";

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
      return null;
    },
  });

  return (
    <header className="sticky left-0 top-0 z-50 outline outline-gray-secondary/50">
      <header className="flex h-auto w-full flex-row items-center justify-between dark:bg-black bg-white px-6 py-3">
        <ArchivrLogo/>
        <DesktopNav className="hidden md:flex" />
        <MobileNav className="flex md:hidden" />
      </header>
      {banData && banData.is_banned ? <BANner banData={banData} /> : null}
    </header>
  );
}
