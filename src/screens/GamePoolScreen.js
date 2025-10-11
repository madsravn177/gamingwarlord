import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/GamePoolScreen.css";

function GamePoolScreen() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [hours, setHours] = useState(""); // Timer
  const [minutes, setMinutes] = useState(""); // Minutter
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchGames();
  }, []);

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

  const handleCompleteGame = async () => {
    if (!selectedGame || isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes >= 60) {
      alert("Please select a game and provide a valid time (hours and minutes).");
      return;
    }

    const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60; // Konverter til sekunder

    try {
      const resultRef = doc(db, "gameResults", `${selectedGame.id}_${username}`);
      const resultDoc = await getDoc(resultRef);

      if (resultDoc.exists()) {
        const existingResult = resultDoc.data();
        if (totalSeconds < existingResult.time) {
          await setDoc(resultRef, {
            gameId: selectedGame.id,
            username: username,
            time: totalSeconds,
          });
          alert(`New best time for ${selectedGame.name}: ${hours}h ${minutes}m!`);
        } else {
          alert(`Your existing time (${Math.floor(existingResult.time / 3600)}h ${Math.floor((existingResult.time % 3600) / 60)}m) is better or equal.`);
        }
      } else {
        await setDoc(resultRef, {
          gameId: selectedGame.id,
          username: username,
          time: totalSeconds,
        });
        alert(`You completed ${selectedGame.name} in ${hours}h ${minutes}m!`);
      }

      setSelectedGame(null);
      setHours("");
      setMinutes("");
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
                {game.name} - Difficulty: {game.difficulty}
              </option>
            ))}
          </select>
          <label htmlFor="hours">Hours:</label>
          <input
            id="hours"
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            min="0"
          />
          <label htmlFor="minutes">Minutes:</label>
          <input
            id="minutes"
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            min="0"
            max="59"
          />
          <button onClick={handleCompleteGame} disabled={!selectedGame || hours === "" || minutes === ""}>
            Mark as Completed
          </button>
        </div>
      )}
    </div>
  );
}

export default GamePoolScreen;