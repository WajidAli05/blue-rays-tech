// context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/admin-auth", {
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