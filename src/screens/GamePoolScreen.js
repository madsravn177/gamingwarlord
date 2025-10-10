import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/GamePoolScreen.css";

function GamePoolScreen() {
  const [games, setGames] = useState([]); // Liste over spil
  const [selectedGame, setSelectedGame] = useState(null); // Valgt spil fra dropdown
  const username = localStorage.getItem("username"); // Hent brugernavn fra localStorage

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

  // Markér spil som gennemført
  const handleCompleteGame = async () => {
    if (!selectedGame) {
      alert("Please select a game to mark as completed.");
      return;
    }

    try {
      const userRef = doc(db, "users", username);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        alert("User not found.");
        return;
      }

      const userData = userDoc.data();

      // Sikrer, at completedGames altid er et array
      const completedGames = Array.isArray(userData.completedGames) ? userData.completedGames : [];

      // Tjek, om spillet allerede er gennemført
      if (completedGames.includes(selectedGame.id)) {
        alert("You have already completed this game.");
        return;
      }

      // Beregn den nye score
      const updatedScore = (userData.score || 0) + selectedGame.points;

      // Opdater kun score og completedGames i Firestore
      const updatedCompletedGames = [...completedGames, selectedGame.id];
      await updateDoc(userRef, {
        score: updatedScore,
        completedGames: updatedCompletedGames,
      });

      alert(`You completed ${selectedGame.name}! ${selectedGame.points} points added to your profile.`);
      setSelectedGame(null); // Nulstil dropdown-valg
    } catch (error) {
      console.error("Error completing game:", error);
    }
  };

  return (
    <div className="game-pool-screen">
      <h1>Mark Completed Games</h1>
      {games.length === 0 ? (
        <p>No games available.</p>
      ) : (
        <div>
          <label htmlFor="game-select">Select a game:</label>
          <select
            id="game-select"
            value={selectedGame ? selectedGame.id : ""}
            onChange={(e) => {
              const game = games.find((g) => g.id === e.target.value);
              setSelectedGame(game || null);
            }}
          >
            <option value="">-- Select a game --</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name} - Difficulty: {game.difficulty} - Points: {game.points}
              </option>
            ))}
          </select>
          <button onClick={handleCompleteGame} disabled={!selectedGame}>
            Mark as Completed
          </button>
        </div>
      )}
    </div>
  );
}

export default GamePoolScreen;