import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/AddGameScreen.css";

function AddGameScreen() {
  const [newGameName, setNewGameName] = useState(""); // Navn på nyt spil
  const [newGameDifficulty, setNewGameDifficulty] = useState(1); // Sværhedsgrad for nyt spil (1-10)

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      const newGame = {
        name: newGameName,
        difficulty: newGameDifficulty,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "games"), newGame);
      alert("Game added successfully!");
      setNewGameName(""); // Nulstil inputfeltet
      setNewGameDifficulty(1); // Nulstil sværhedsgrad
    } catch (error) {
      console.error("Error adding game:", error);
      alert("Failed to add game. Please try again.");
    }
  };

  return (
    <div className="add-game-screen">
      <h1>Add a New Game</h1>
      <form onSubmit={handleAddGame}>
        <input
          type="text"
          placeholder="Game Name"
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
          required
        />
        <label htmlFor="difficulty">Difficulty (1-10):</label>
        <select
          id="difficulty"
          value={newGameDifficulty}
          onChange={(e) => setNewGameDifficulty(Number(e.target.value))}
          required
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
        <button type="submit">Add Game</button>
      </form>
    </div>
  );
}

export default AddGameScreen;