import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Brug useNavigate til navigation

  const handleLogin = (e) => {
    e.preventDefault();

    // Simuler login-logik
    if (username && password) {
      localStorage.setItem("username", username); // Gem brugernavn i localStorage
      alert("Login successful!");
      console.log("Navigating to HomeScreen..."); // Debugging
      navigate("/"); // Naviger til HomeScreen
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginScreen;