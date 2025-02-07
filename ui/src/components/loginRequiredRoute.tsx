import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "./ui/loading-spinner";


// Prompts user to log in before seeing the thing
const LoginRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(()=>{
    if (localStorage.getItem("auth") !== "true"){
      navigate('/login');
    }
  });

  if (localStorage.getItem("auth") === "true"){
    return children;
  }
  else{
    return <LoadingSpinner></LoadingSpinner>
  }
};

export default LoginRequiredRoute;
