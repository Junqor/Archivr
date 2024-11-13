import Header from "@/components/header";
import ProtectedRoute from "@/components/protectedRoute";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col w-screen h-screen overflow-y-auto font-normal bg-black">
        <Header />
        <div className="max-w-[960px] w-full h-full mx-auto mt-5 flex flex-col items-center justify-start">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};
