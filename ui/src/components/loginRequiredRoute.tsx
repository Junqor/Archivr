import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "./ui/loading-spinner";
import { useAuth } from "@/context/auth";


// Prompts user to log in before seeing the thing
const LoginRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(()=>{
    if (!user){
      navigate('/login');
    }
  });

  if (user){
    return children;
  }
  else{
    return <LoadingSpinner></LoadingSpinner>
  }
};

export default LoginRequiredRoute;
