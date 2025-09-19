/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";

type StatusContextType = {
  chatGeneralHistory: string | null;
  setChatGeneralHistory: React.Dispatch<React.SetStateAction<string | null>>;
};

// context created
const StatusContext = createContext<StatusContextType | null>(null);

// export context provider
export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const [chatGeneralHistory, setChatGeneralHistory] = useState<string | null>(null);
  const { user } = useAuth();

 
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem("chatHistory");
    setChatGeneralHistory(stored); 
  }, []);

  const statusObject = { chatGeneralHistory, setChatGeneralHistory };

  return (
    <StatusContext.Provider value={statusObject}>
      {children}
    </StatusContext.Provider>
  );
};

// using the context hook
export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) throw new Error("useStatus must be used within a StatusProvider");
  return context;
};
