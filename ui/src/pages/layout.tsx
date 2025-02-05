// layout.tsx
import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="flex h-auto min-h-screen w-full flex-col justify-start bg-black font-normal">
      <Header />
      <div className="mx-auto mt-5 flex h-full w-full max-w-2xl flex-col items-center justify-start gap-5 px-4 pb-5 sm:max-w-[960px] sm:px-0">
        <Outlet />
      </div>
    </div>
  );
};
