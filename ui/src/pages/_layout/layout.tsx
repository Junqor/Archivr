// layout.tsx
import { useTheme } from "@/context/theme";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import Footer from "@/pages/_layout/components/footer";
import Header from "@/pages/_layout/components/header";
import { THEME } from "@/types/theme";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const {theme} = useTheme();

  useScrollRestoration();
  return (
    <div className={"flex h-auto min-h-screen w-full flex-col justify-start bg-black font-normal "+(theme==THEME.LIGHT?"light":"dark")}>
      <Header />
      <div className="mt-5 flex h-full w-full items-center justify-center px-4 pb-10 sm:pb-20">
        <div className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-5 sm:max-w-[960px]">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};
