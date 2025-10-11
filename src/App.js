import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import HomeScreen from "./screens/HomeScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import DashboardScreen from "./screens/DashboardScreen";
import GamePoolScreen from "./screens/GamePoolScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("username"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("username"));
    };

    // Overvåg ændringer i localStorage
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      {isAuthenticated && <Navbar />} {/* Vis Navbar kun, hvis brugeren er logget ind */}
      <Routes>
        {/* Offentlige sider */}
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        {/* Beskyttede sider */}
        <Route
          path="/"
          element={
            isAuthenticated ? <HomeScreen /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/leaderboard"
          element={
            isAuthenticated ? <LeaderboardScreen /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardScreen /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/gamepool"
          element={
            isAuthenticated ? <GamePoolScreen /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
