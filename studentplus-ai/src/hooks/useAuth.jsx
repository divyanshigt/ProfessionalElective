import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("sp_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const registered = JSON.parse(localStorage.getItem("sp_registered_user"));

    const finalUser = registered && registered.email === email
      ? { name: registered.name, email }
      : { name: "Kavin Gupta", email };

    localStorage.setItem("sp_user", JSON.stringify(finalUser));
    localStorage.setItem("sp_token", "demo-token");
    setUser(finalUser);
    return finalUser;
  };

  const logout = () => {
    localStorage.removeItem("sp_user");
    localStorage.removeItem("sp_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};