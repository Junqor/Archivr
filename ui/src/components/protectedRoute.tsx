// protectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
