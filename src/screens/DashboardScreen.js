import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function DashboardScreen() {
  const [games, setGames] = useState([]); // Liste over spil
  const [name, setName] = useState(""); // Navn på nyt spil
  const [difficulty, setDifficulty] = useState(1); // Sværhedsgrad for nyt spil

  useEffect(() => {
    fetchGames();
  }, []);

  // Hent spil fra Firestore
  const fetchGames = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "games"));
      const gamesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(gamesData);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  // Tilføj nyt spil
  const handleAddGame = async (name, difficulty) => {
    if (!name || difficulty < 1 || difficulty > 10) {
      alert("Please provide a valid game name and difficulty (1-10).");
      return;
    }

    try {
      const newGame = {
        name,
        difficulty,
        points: difficulty, // Points er lig med sværhedsgraden
      };

      await addDoc(collection(db, "games"), newGame);
      alert("Game added successfully!");
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAddGame(name, difficulty);
    setName("");
    setDifficulty(1);
    fetchGames(); // Opdater spilliste
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Form til at tilføje spil */}
      <div>
        <h2>Add a Game</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Game Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Difficulty (1-10):
            <input
              type="number"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              min="1"
              max="10"
              required
            />
          </label>
          <button type="submit">Add Game</button>
        </form>
      </div>

      {/* Liste over spil */}
      <div>
        <h2>Game List</h2>
        {games.length === 0 ? (
          <p>No games available.</p>
        ) : (
          <ul>
            {games.map((game) => (
              <li key={game.id}>
                {game.name} - Difficulty: {game.difficulty} - Points: {game.points}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DashboardScreen;