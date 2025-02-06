import { RouterProvider } from "react-router-dom";
import router from "./config/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/auth";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
      <Toaster position="bottom-right" toastOptions={{}} />
    </QueryClientProvider>
  );
}

function Router() {
  const { setLoginData } = useAuth();
  useEffect(() => {
    setLoginData(); // Set the user data on mount
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
