/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import type { AxiosInstance } from "axios";
import axios from "axios";

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: any) => void;
}> = [];

// Helper functions for token management
const getTokens = () => {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: localStorage.getItem("access"),
    refresh: localStorage.getItem("refresh"),
  };
};

const setTokens = (access: string, refresh: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  }
};

const removeTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  }
};

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: "http://10.10.12.53:9000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

const pathNotNeedToken = window.location.pathname === "/" || window.location.pathname === "/login" || window.location.pathname === "/regenser"

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;
    if (token && !pathNotNeedToken) {
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
  async (error) => {
    const originalRequest = error.config;

    console.error("Response error:", error);
    if (error.request && !error.response) {
      console.error("Network error detected - no response received");
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const tokens = getTokens();
        if (tokens.refresh) {
          console.log("🔄 Attempting to refresh access token...");

          const refreshResponse = await axios.post(
            "http://10.10.12.53:8000/api/users/token/refresh/",
            {
              refresh: tokens.refresh,
            }
          );

          console.log("✅ Token refresh successful:", refreshResponse.data);

          if (refreshResponse.data.access && refreshResponse.data.refresh) {
            // Update tokens with new access token AND new refresh token
            setTokens(
              refreshResponse.data.access,
              refreshResponse.data.refresh
            );

            // Update the authorization header for the original request
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;

            // Process any queued requests with the new token
            processQueue(null, refreshResponse.data.access);
            isRefreshing = false;

            // Retry the original request with new token
            return axiosInstance(originalRequest);
          }
        }

        throw new Error("No refresh token available");
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Process queue with error
        processQueue(refreshError, null);
        isRefreshing = false;

        // Only redirect to login if we're on a protected route
        const currentPath =
          typeof window !== "undefined" ? window.location.pathname : "";
        const isProtectedRoute =
          currentPath.startsWith("/chat") ||
          currentPath.startsWith("/settings") ||
          currentPath.startsWith("/profile");

        if (isProtectedRoute) {
          // If refresh fails, clear tokens and redirect to login
          removeTokens();

          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/login"
          ) {
            console.log("🔄 Redirecting to login...");
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
