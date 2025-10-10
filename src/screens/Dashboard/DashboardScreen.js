import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore-funktioner
import { db } from "../../firebase/firebaseConfig"; // Import Firestore-konfiguration

function DashboardScreen() {
  const [game, setGame] = useState("");
  const [score, setScore] = useState(0);

  const handleAddGame = async () => {
    try {
      await addDoc(collection(db, "games"), {
        name: game,
        score: parseInt(score, 10)
      });
      alert("Game added successfully!");
      setGame("");
      setScore(0);
    } catch (error) {
      console.error("Error adding game: ", error);
    }
  };

  return (
    <div className="dashboard-screen">
      <h1>Dashboard</h1>
      <input
        type="text"
        placeholder="Game name"
        value={game}
        onChange={(e) => setGame(e.target.value)}
      />
      <input
        type="number"
        placeholder="Score"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />
      <button onClick={handleAddGame}>Add Game</button>
    </div>
  );
}

export default DashboardScreen;