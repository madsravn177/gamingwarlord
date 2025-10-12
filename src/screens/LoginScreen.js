import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../contexts/AuthContext"; // Sørg for korrekt sti
import "../styles/LoginScreen.css";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // `login` bruges i handleLogin, så det er korrekt defineret og brugt

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", username); // Hent brugerens dokument fra Firestore
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.password === password) {
          // Opdater loginstatus
          login(username);

          // Naviger til HomeScreen
          navigate("/");

          alert("Login successful!");
        } else {
          alert("Incorrect password. Please try again.");
        }
      } else {
        alert("User not found. Please check your username.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-screen">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginScreen;