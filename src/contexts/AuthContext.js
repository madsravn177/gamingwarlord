import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Tjek om brugeren allerede er logget ind via localStorage
    const username = localStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (username) => {
    setIsLoggedIn(true);
    localStorage.setItem("username", username); // Gem brugernavn i localStorage
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("username"); // Fjern brugernavn fra localStorage
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);