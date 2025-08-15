"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useAxios } from "./AxiosProvider";

// Define user interface
interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; message?: string }>;
  refreshToken: () => Promise<boolean>;
  updateUser: (
    userData: Partial<User>
  ) => Promise<{ success: boolean; message?: string }>;
  checkAuth: () => Promise<void>;
}

// Define registration data interface
interface RegisterData {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const axiosInstance = useAxios();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated
  const checkAuth = async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      // Verify token and get user data
      const response = await axiosInstance.get("/auth/me");
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear invalid tokens
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.data) {
        const { access_token, refresh_token, user: userData } = response.data;

        // Store tokens
        localStorage.setItem("access", access_token);
        localStorage.setItem("refresh", refresh_token);

        // Set user data
        setUser(userData);

        return { success: true, message: "Login successful" };
      }

      return { success: false, message: "Login failed" };
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

 
  const register = async (
    userData: RegisterData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/register", userData);

      if (response.data) {
        const { access_token, refresh_token, user: newUser } = response.data;

        // Store tokens
        localStorage.setItem("access", access_token);
        localStorage.setItem("refresh", refresh_token);

        // Set user data
        setUser(newUser);

        return { success: true, message: "Registration successful" };
      }

      return { success: false, message: "Registration failed" };
    } catch (error: any) {
      console.error("Registration error:", error);
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    try {
      // Clear tokens from localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Clear user state
      setUser(null);

      // Optionally call logout endpoint
      axiosInstance.post("/auth/logout").catch(() => {
        // Ignore logout endpoint errors
      });

      // Redirect to login page
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem("refresh");
      if (!refreshTokenValue) {
        return false;
      }

      const response = await axiosInstance.post("/auth/refresh", {
        refresh_token: refreshTokenValue,
      });

      if (response.data && response.data.access_token) {
        localStorage.setItem("access", response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem("refresh", response.data.refresh_token);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  // Update user function
  const updateUser = async (
    userData: Partial<User>
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put("/auth/profile", userData);

      if (response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true, message: "Profile updated successfully" };
      }

      return { success: false, message: "Profile update failed" };
    } catch (error: any) {
      console.error("Profile update error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Profile update failed";
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    refreshToken,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export types for use in other components
export type { User, AuthContextType, RegisterData };
