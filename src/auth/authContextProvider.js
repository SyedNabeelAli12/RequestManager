import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const data = await api.getCurrentUser();
      if (data) {
        const jwtToken = data.jwtToken;
        if (jwtToken) {
          localStorage.setItem("jwtToken", jwtToken);
        }
        const { jwtToken: _, ...userData } = data;
        setUser(userData);
      }
    };

    fetchCurrentUser();
  }, []);

  const logout = async () => {
    await api.logout(user);
    setUser(null);
    localStorage.removeItem("jwtToken");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
