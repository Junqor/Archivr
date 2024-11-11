import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createContext, useContext } from "react";

type TUser = {
  userName: string;
  id: string;
};

export type TUserContext = {
  user: TUser;
  login: (userName: string) => void;
  logout: () => void;
};
export type AuthProviderProps = React.PropsWithChildren<{}>;

const AuthContext = createContext<TUserContext>({
  user: { userName: "", id: "" },
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage("user");

  const login = (user: string) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  let userObject = { userName: "", id: "" };

  if (user) {
    userObject = JSON.parse(user) as TUser;
  }

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
