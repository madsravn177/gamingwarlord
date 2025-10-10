import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css"; // Import CSS-filen

function Navbar() {
  const navigate = useNavigate(); // Brug useNavigate til navigation
  const location = useLocation(); // Hent den aktuelle route

  // Hent brugernavn fra localStorage
  const username = localStorage.getItem("username");

  // Skjul Navbar på login- og signup-siderne
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);
  if (hideNavbar) {
    return null; // Returnér ingenting, hvis Navbar skal skjules
  }

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
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          <Link to="/dashboard">Add Games</Link>
        </li>
        <li>
          <Link to="/gamepool">Complete Games</Link>
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