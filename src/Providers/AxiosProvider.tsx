/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

const axiosInstance = axios.create({
  baseURL: "http://10.10.12.53:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // if (
    //   config.url &&
    //   !config.url.startsWith("http") &&
    //   config.url.startsWith("/api")
    // ) {
    // }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    if (error.request && !error.response) {
      console.error("Network error detected - no response received");
    }

    if (error.response?.status === 401) {
      // Remove the correct token names that match what you're setting in the Login component
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Check if we're not already on the login page to prevent redirect loops
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

import type { AxiosInstance } from "axios";
import axios from "axios";

const AxiosContext = createContext<AxiosInstance | null>(null);

export const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = () => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};

export default axiosInstance;
