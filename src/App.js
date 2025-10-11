import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import HomeScreen from "./screens/HomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import GamePoolScreen from "./screens/GamePoolScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import OverallLeaderboardScreen from "./screens/OverallLeaderboardScreen";
import UserCompletedGamesScreen from "./screens/UserCompletedGamesScreen";
import GameLeaderboardScreen from "./screens/GameLeaderboardScreen";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("username"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("username"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomeScreen /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardScreen /> : <Navigate to="/login" />} />
        <Route path="/gamepool" element={isAuthenticated ? <GamePoolScreen /> : <Navigate to="/login" />} />
        <Route path="/completed-games" element={isAuthenticated ? <UserCompletedGamesScreen /> : <Navigate to="/login" />} />
        <Route path="/overall-leaderboard" element={isAuthenticated ? <OverallLeaderboardScreen /> : <Navigate to="/login" />} />
        <Route path="/leaderboard/:gameId" element={isAuthenticated ? <GameLeaderboardScreen /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
