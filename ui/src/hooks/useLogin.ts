import { useAuth } from "@/context/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (args: { email: string; password: string }) => {
      const data = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
        body: JSON.stringify(args),
        method: "POST",
      });
      return data.json();
    },
    onSuccess: (data) => {
      // Store userName and in context
      // TODO: add user Id and use a token
      login(data.user);
    },
  });
};
