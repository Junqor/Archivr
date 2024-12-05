import { checkAuth } from "@/api/admin";
import { useEffect, useState } from "react";
import { TUser } from "@/types/user";
import { LoadingSpinner } from "./ui/loading-spinner";
import { toast } from "sonner";

// Protects routes so only admins can access them
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null | "invalid">(null);

  useEffect(() => {
    checkAuth()
      .then((user) => setUser(user))
      .catch((err) => {
        toast.error(err.message);
        setUser("invalid");
      });
  }, []);

  if (!user) {
    return <LoadingSpinner size="large" className="pt-16" />;
  }

  if (typeof user !== "object" || user.role !== "admin") {
    throw { status: 403 };
  }

  return children;
};

export default ProtectedRoute;
