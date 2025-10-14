import React, { createContext, useState, useContext, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true); // Til at vise loading state under tjek

  useEffect(() => {
    const verifyUserExists = async () => {
      const storedUser = localStorage.getItem("username");

      if (storedUser) {
        try {
          const userRef = doc(db, "users", storedUser);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setIsLoggedIn(true);
            setUsername(storedUser);
          } else {
            // Hvis brugeren er slettet i databasen
            console.warn("Brugeren findes ikke længere i databasen. Logger ud...");
            localStorage.removeItem("username");
            setIsLoggedIn(false);
            setUsername(null);
          }
        } catch (error) {
          console.error("Fejl under verificering af bruger:", error);
          // Fallback: antag at brugeren ikke længere er gyldig
          localStorage.removeItem("username");
          setIsLoggedIn(false);
          setUsername(null);
        }
      }

      setCheckingUser(false);
    };

    verifyUserExists();
  }, []);

  const login = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem("username", user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem("username");
  };

  if (checkingUser) {
    // Vis evt. en loader eller ingenting, mens vi tjekker Firestore
    return <div>Indlæser bruger...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
