import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { db } from "../../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom"; // Importér useNavigate

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialiser useNavigate

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      // Hent brugerdata fra Firestore
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          console.log("Navigating to /home");
          navigate("/home"); // Naviger direkte til HomeScreen
        } else {
          alert("Invalid username or password.");
        }
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-screen">
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default LoginScreen;