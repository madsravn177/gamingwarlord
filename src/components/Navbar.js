import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate(); // Brug useNavigate til navigation
  const location = useLocation(); // Hent den aktuelle route

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
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#f4f4f4", alignItems: "center" }}>
      <ul style={{ display: "flex", listStyle: "none", gap: "20px", margin: 0, padding: 0 }}>
        <li>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/leaderboard" style={{ textDecoration: "none", color: "black" }}>
            Leaderboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard" style={{ textDecoration: "none", color: "black" }}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/gamepool" style={{ textDecoration: "none", color: "black" }}>
            Game Pool
          </Link>
        </li>
      </ul>
      <button
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;