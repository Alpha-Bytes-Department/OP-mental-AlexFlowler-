import  { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useAxios } from "./AxiosProvider";

interface User {
  id: string;
  email: string;
  username?: string;
  profile_image?: string;
  name?: string;
  is_subscribed: boolean;
}


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}



interface AuthContextType {
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>; // 
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const axios = useAxios();

    const logout = async () => {
    try {
      await axios.post("/api/users/logout/"); 
    } catch {
    } finally {
      setUser(null);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    }
  };
  

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/users/profile/");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser: fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
