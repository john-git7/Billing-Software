import React, { createContext, useContext, useEffect, useState } from "react";
import services from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState("loading");

  // ✅ Check auth state on app load with Retry Logic
  useEffect(() => {
    let retries = 0;
    const maxRetries = 10; // 5 seconds (500ms * 10)

    const checkAuth = async () => {
      try {
        const res = await services.auth.getCurrentUser();
        setUser(res.data);
        setAuthStatus("authenticated");
      } catch (err) {
        if (err.code === "ERR_NETWORK" && retries < maxRetries) {
          retries++;
          // Silently retry after delay
          setTimeout(checkAuth, 500);
          return;
        }

        if (err.response?.status !== 401) {
          console.error("Auth check failed", err);
        }
        setUser(null);
        setAuthStatus("unauthenticated");
      }
    };
    checkAuth();
  }, []);


  // ✅ Start Google OAuth (backend handles everything)
  const loginWithGoogle = () => {
    window.open("http://localhost:5000/auth/google", "_blank");
  };


  // ✅ Logout (backend-side)
  const logout = async () => {
    try {
      await services.auth.logout();
    } finally {
      localStorage.removeItem("token"); // ✅ Clear token from localStorage
      setUser(null);
      setAuthStatus("unauthenticated");
    }
  };

  // ✅ Set token and authenticate (for Electron OAuth callback)
  const setTokenAndAuthenticate = async (token) => {
    localStorage.setItem("token", token);
    try {
      const res = await services.auth.getCurrentUser();
      const userData = res.data;
      setUser(userData);
      setAuthStatus("authenticated");

      // Send user info to analytics (Electron only)
      if (window.electron && window.electron.sendUserInfo) {
        window.electron.sendUserInfo({
          name: userData.name || userData.displayName,
          email: userData.email
        });
      }
    } catch (err) {
      console.error("Failed to authenticate with token:", err);
      localStorage.removeItem("token");
      setAuthStatus("unauthenticated");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authStatus,
        isAuthenticated: authStatus === "authenticated",
        loginWithGoogle,
        logout,
        setTokenAndAuthenticate, // ✅ Expose new method
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
