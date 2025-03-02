import { RouterProvider } from "react-router-dom";
import router from "./config/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/auth";
import { Toaster } from "./components/ui/sonner";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./pages/loadingScreen";
import { SettingsProvider } from "./context/settings";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <Router />
        </SettingsProvider>
      </AuthProvider>
      <Toaster position="bottom-right" toastOptions={{}} />
    </QueryClientProvider>
  );
}

function Router() {
  const [loading, setLoading] = useState(true);
  const { setLoginData } = useAuth();

  useEffect(() => {
    const initializeLogin = async () => {
      try {
        await setLoginData(); // Set the user data on mount
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    initializeLogin();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return <RouterProvider router={router} />;
}

export default App;
