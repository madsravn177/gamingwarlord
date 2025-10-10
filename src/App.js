import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import "./styles/colors.css";
import HomeScreen from "./screens/Home/HomeScreen";
import LeaderboardScreen from "./screens/Leaderboard/LeaderboardScreen";
import DashboardScreen from "./screens/Dashboard/DashboardScreen";
import SignUpScreen from "./screens/SignUp/SignUpScreen";
import LoginScreen from "./screens/Login/LoginScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
