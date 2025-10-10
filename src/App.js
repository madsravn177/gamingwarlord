import React from "react";
import "./styles/global.css"; // Globale styles
import "./styles/colors.css"; // Farver
import HomeScreen from "./screens/Home/HomeScreen"; // Import HomeScreen
import LeaderboardScreen from "./screens/Leaderboard/LeaderboardScreen"; // Import LeaderboardScreen

function App() {
  console.log("App is rendering");
  return (
    <div className="App">
      <HomeScreen />
      <LeaderboardScreen />
    </div>
  );
}

export default App;
