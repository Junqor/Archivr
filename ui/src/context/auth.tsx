import { getUserInfoFromToken } from "@/api/auth";
import { TUser } from "@/types/user";
import { createContext, useContext, useState } from "react";

export type TUserContext = {
  user: TUser | null;
  setLoginData: () => Promise<void>;
  logout: () => void;
};
export type AuthProviderProps = React.PropsWithChildren<{}>;

const AuthContext = createContext<TUserContext | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<TUser | null>(null);

  const setLoginData = async () => {
    try {
      const userData = await getUserInfoFromToken();
      setUser(userData);
    } catch (e) {
      localStorage.removeItem("access_token");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        setLoginData: setLoginData,
        logout: logout,
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
