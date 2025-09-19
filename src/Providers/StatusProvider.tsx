/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

type StatusContextType = {
  chatGeneralHistory: boolean;
  setChatGeneralHistory: React.Dispatch<React.SetStateAction<boolean>>;
};

const StatusContext = createContext<StatusContextType | null>(null);

export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const [chatGeneralHistory, setChatGeneralHistory] = useState<boolean>(false);

  const statusObject = { chatGeneralHistory, setChatGeneralHistory };
  return (
    <StatusContext.Provider value={statusObject}>
      {children}
    </StatusContext.Provider>
  );
};

// using the context hooks
export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) throw new Error("useStatus must be used within a StatusProvider");
  return context;
};