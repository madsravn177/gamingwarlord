import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username"); // Fjern brugernavn fra localStorage
    setIsAuthenticated(false); // Opdater isAuthenticated til false
    navigate("/login"); // Naviger til login-siden
  };

  if (!isAuthenticated) {
    return null; // Skjul Navbar, hvis brugeren ikke er autentificeret
  }

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Game Leaderboard</Link>
        </li>
        <li>
          <Link to="/add-game">Add Game</Link>
        </li>
        <li>
          <Link to="/gamepool">Complete Game</Link>
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