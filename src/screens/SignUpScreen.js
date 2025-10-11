import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", username);
      await setDoc(userRef, {
        username,
        password, // Gemmer brugerens adgangskode
        score: 0,
        completedGames: [],
        type: "user",
        createdAt: serverTimestamp(),
      });
      alert("Account created successfully!");
      navigate("/login"); // Naviger til login-siden
    } catch (error) {
      console.error("Error creating account:", error);
      alert("An error occurred while creating the account. Please try again.");
    }
  };

  return (
    <div className="signup-screen">
      <div className="signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
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
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default SignUpScreen;