import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute"; // ← brug kun denne

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Offentlige sider */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/login" element={<LoginScreen />} />

          {/* Beskyttede sider */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardScreen />
              </ProtectedRoute>
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
