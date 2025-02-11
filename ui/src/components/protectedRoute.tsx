import { useAuth } from "@/context/auth";

// Protects routes so only admins can access them
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    throw { status: 403 };
  }

  return children;
};

export default ProtectedRoute;
