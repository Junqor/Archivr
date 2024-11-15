import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createContext, useContext } from "react";

type TUser = {
  name: string;
  id: string;
};

export type TUserContext = {
  user: TUser | null;
  login: (user: TUser) => void;
  logout: () => void;
};
export type AuthProviderProps = React.PropsWithChildren<{}>;

const AuthContext = createContext<TUserContext | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage("user");

  const login = (user: TUser) => {
    setUser(JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    window.location.reload();
  };

  const userObject = user ? (JSON.parse(user) as TUser) : null;

  return (
    <AuthContext.Provider value={{ user: userObject, login, logout }}>
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
