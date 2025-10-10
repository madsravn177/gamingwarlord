import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/global.css"; // Globale styles
import "./styles/colors.css"; // Farver
import HomeScreen from "./screens/Home/HomeScreen"; // Import HomeScreen
import LeaderboardScreen from "./screens/Leaderboard/LeaderboardScreen"; // Import LeaderboardScreen
import DashboardScreen from "./screens/Dashboard/DashboardScreen";
import SignUpScreen from "./screens/SignUp/SignUpScreen";
import LoginScreen from "./screens/Login/LoginScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
