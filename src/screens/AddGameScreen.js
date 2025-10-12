import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/AddGameScreen.css";

function AddGameScreen() {
  const [newGameName, setNewGameName] = useState("");

  const handleAddGame = async (e) => {
    e.preventDefault();

    try {
      // Tilføj spillet til Firestore
      await addDoc(collection(db, "games"), {
        name: newGameName,
      });

      alert("Game added successfully!");
      setNewGameName("");
    } catch (error) {
      console.error("Error adding game:", error);
      alert("Failed to add game. Please try again.");
    }
  };

  return (
    <div className="main-content add-game-screen">
      <h1>Add a New Game</h1>
      <form onSubmit={handleAddGame}>
        <input
          type="text"
          placeholder="Game Name"
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
          required
        />
        <button type="submit">Add Game</button>
      </form>
    </div>
  );
}

export default AddGameScreen;