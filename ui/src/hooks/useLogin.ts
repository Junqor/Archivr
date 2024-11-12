import { useAuth } from "@/context/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (args: { username: string; password: string }) => {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/auth/login",
        {
          body: JSON.stringify({
            username: args.username,
            password: args.password,
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        localStorage.setItem("auth", "true");
        window.dispatchEvent(new Event("storage"));
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
      return data.user;
    },
    onSuccess: (data) => {
      // Store user in context
      // TODO: use a token
      login(data);
    },
  });
};
