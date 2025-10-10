import React, { useState } from "react";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { db } from "../../firebase/firebaseConfig";
import { Link } from "react-router-dom";

function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      // Tjek, om brugernavnet allerede findes
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Username already exists. Please choose another one.");
        return;
      }

      // Hash adgangskoden
      const hashedPassword = await bcrypt.hash(password, 10);

      // Opret en ny bruger i Firestore
      await setDoc(doc(db, "users", username), {
        username: username,
        password: hashedPassword,
        score: 0, // Start med 0 point
        createdAt: new Date(), // Tidspunkt for oprettelse
        type: "user" // Standard brugerrolle
      });

      alert("User registered successfully!");
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Error signing up: ", error);
      alert("Error registering user.");
    }
  };

  return (
    <div className="sign-up-screen">
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default SignUpScreen;