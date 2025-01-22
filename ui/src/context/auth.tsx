import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createContext, useContext } from "react";

type TUser = {
  username: string;
  id: string;
  role: string;
};

export type TUserContext = {
  user: TUser | null;
  addLoginDataToLocalStorage: (user: TUser) => void;
  removeLoginDataFromLocalStorage: () => void;
};
export type AuthProviderProps = React.PropsWithChildren<{}>;

const AuthContext = createContext<TUserContext | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage("user");

  const addLoginDataToLocalStorage = (user: TUser) => {
    localStorage.setItem("auth", "true");
    window.dispatchEvent(new Event("storage"));
    setUser(JSON.stringify(user));
  };

  const removeLoginDataFromLocalStorage = () => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  const userObject = user ? (JSON.parse(user) as TUser) : null;

  return (
    <AuthContext.Provider
      value={{
        user: userObject,
        addLoginDataToLocalStorage,
        removeLoginDataFromLocalStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
