import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Korrekt sti
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // Hent loginstatus og logout-funktion fra AuthContext
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    logout(); // Brug logout-funktionen fra AuthContext
    navigate("/login"); // Naviger til login-siden
  };

  if (!isLoggedIn) {
    return null; // Skjul Navbar, hvis brugeren ikke er logget ind
  }

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Game List</Link>
        </li>
        <li>
          <Link to="/add-game">Add Game</Link>
        </li>
        <li>
          <Link to="/complete-game">Complete Game</Link>
        </li>
        <li>
          <Link to="/completed-games">Completed Games</Link>
        </li>
        <li>
          <Link to="/overall-leaderboard">Overall Leaderboard</Link>
        </li>
      </ul>
      <div className="navbar-user">
        <span>
          <strong>{username}</strong>
        </span>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;