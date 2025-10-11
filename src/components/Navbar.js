import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Hent brugernavn fra localStorage

  const handleLogout = () => {
    localStorage.removeItem("username"); // Fjern brugernavn fra localStorage
    navigate("/login"); // Naviger til login-siden
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/gamepool">Game Pool</Link>
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
          Logged in as: <strong>{username}</strong>
        </span>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;