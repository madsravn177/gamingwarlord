import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where, serverTimestamp } from "firebase/firestore";
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
          // Opdater kun, hvis den nye tid er bedre
          const calculatedPoints = await calculatePoints(selectedGame.id, totalSeconds, selectedGame.difficulty);
          await setDoc(resultRef, {
            gameId: selectedGame.id,
            username: username,
            time: totalSeconds,
            points: calculatedPoints,
            timestamp: serverTimestamp(), // Tilføj serverens aktuelle tidsstempel
          });
          alert(`New best time for ${selectedGame.name}: ${hours}h ${minutes}m!`);
          await updateUserPoints(selectedGame.id, totalSeconds, selectedGame.difficulty, existingResult.time);
        } else {
          alert(`Your existing time (${Math.floor(existingResult.time / 3600)}h ${Math.floor((existingResult.time % 3600) / 60)}m) is better or equal.`);
        }
      } else {
        // Opret nyt resultat, hvis det ikke findes
        const calculatedPoints = await calculatePoints(selectedGame.id, totalSeconds, selectedGame.difficulty);
        await setDoc(resultRef, {
          gameId: selectedGame.id,
          username: username,
          time: totalSeconds,
          points: calculatedPoints,
          timestamp: serverTimestamp(), // Tilføj serverens aktuelle tidsstempel
        });
        alert(`You completed ${selectedGame.name} in ${hours}h ${minutes}m!`);
        await updateUserPoints(selectedGame.id, totalSeconds, selectedGame.difficulty, null);
      }

      setSelectedGame(null);
      setHours("");
      setMinutes("");
    } catch (error) {
      console.error("Error completing game:", error);
    }
  };

  const updateUserPoints = async (gameId, newTime, difficulty, oldTime) => {
    try {
      const userRef = doc(db, "users", username);
      const userDoc = await getDoc(userRef);

      const basePoints = [25, 18, 12, 10, 8, 6]; // Point for placeringer
      const resultsRef = collection(db, "gameResults");
      const q = query(resultsRef, where("gameId", "==", gameId));
      const querySnapshot = await getDocs(q);

      // Find placering baseret på tid
      const sortedResults = querySnapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a.time - b.time);
      const placement = sortedResults.findIndex((r) => r.username === username) + 1;

      const newPoints = basePoints[placement - 1] ? basePoints[placement - 1] * difficulty : 0;

      // Beregn gamle point, hvis der var en tidligere tid
      const oldPoints = oldTime
        ? basePoints[sortedResults.findIndex((r) => r.time === oldTime)] * difficulty
        : 0;

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const totalPoints = userData.totalPoints || 0;

        // Opdater brugerens samlede point
        await updateDoc(userRef, {
          totalPoints: totalPoints - oldPoints + newPoints,
        });
      } else {
        // Opret brugerens dokument, hvis det ikke findes
        await setDoc(userRef, {
          username: username,
          totalPoints: newPoints,
        });
      }
    } catch (error) {
      console.error("Error updating user points:", error);
    }
  };

  const calculatePoints = async (gameId, time, difficulty) => {
    const basePoints = [25, 18, 12, 10, 8, 6]; // Point for placeringer
    const resultsRef = collection(db, "gameResults");
    const q = query(resultsRef, where("gameId", "==", gameId));
    const querySnapshot = await getDocs(q);

    // Find placering baseret på tid
    const sortedResults = querySnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => a.time - b.time);
    const placement = sortedResults.findIndex((r) => r.time === time) + 1;

    return basePoints[placement - 1] ? basePoints[placement - 1] * difficulty : 0;
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