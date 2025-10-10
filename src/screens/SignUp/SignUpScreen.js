import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import bcrypt from "bcryptjs";

function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash adgangskoden

      await addDoc(collection(db, "users"), {
        username: username,
        password: hashedPassword,
        score: 0
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
    </div>
  );
}

export default SignUpScreen;