// context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin-auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setAdmin(data.user);
        setAuthLoading(false);
      })
      .catch(() => {
        setAdmin(null);
        setAuthLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ admin, setAdmin, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};