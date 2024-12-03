// layout.tsx
import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="flex flex-col justify-start w-full h-auto min-h-screen overflow-y-auto font-normal bg-black">
      <Header />
      <div className="sm:max-w-[960px] max-w-2xl w-full h-full mx-auto mt-5 flex flex-col items-center justify-start gap-5 px-4 sm:px-0">
        <Outlet />
      </main>
    </div>
  );
};
