import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import HomeScreen from "./screens/HomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import CompleteGameScreen from "./screens/CompleteGameScreen";
import AddGameScreen from "./screens/AddGameScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import OverallLeaderboardScreen from "./screens/OverallLeaderboardScreen";
import UserCompletedGamesScreen from "./screens/UserCompletedGamesScreen";
import GameLeaderboardScreen from "./screens/GameLeaderboardScreen";
import { AuthProvider } from "./contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("username");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("username"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("username"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Offentlige ruter */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/login" element={<LoginScreen />} />

          {/* Beskyttede ruter */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardScreen /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/complete-game"
            element={
              <ProtectedRoute>
                <CompleteGameScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-game"
            element={
              <ProtectedRoute>
                <AddGameScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overall-leaderboard"
            element={
              <ProtectedRoute>
                <OverallLeaderboardScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-completed-games"
            element={
              <ProtectedRoute>
                <UserCompletedGamesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game-leaderboard"
            element={
              <ProtectedRoute>
                <GameLeaderboardScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/completed-games"
            element={
              <ProtectedRoute>
                <UserCompletedGamesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard/:gameId"
            element={
              <ProtectedRoute>
                <GameLeaderboardScreen />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
