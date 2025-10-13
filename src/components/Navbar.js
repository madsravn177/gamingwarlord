import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Game List</Link></li>
        <li><Link to="/add-game">Add Game</Link></li>
        <li><Link to="/completed-games">Completed Games</Link></li>
        <li><Link to="/complete-game">Complete Game</Link></li>
        <li><Link to="/overall-leaderboard">Overall Leaderboard</Link></li>
      </ul>
      <div className="navbar-user">
        <span><strong>{username}</strong></span>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
