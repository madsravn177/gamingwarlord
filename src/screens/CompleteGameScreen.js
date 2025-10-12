import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/CompleteGameScreen.css";

function CompleteGameScreen() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [hours, setHours] = useState(""); // Timer
  const [minutes, setMinutes] = useState(""); // Minutter
  const [loading, setLoading] = useState(true); // Tilføj loading state

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      console.log("Fetching games from Firestore...");
      const querySnapshot = await getDocs(collection(db, "games"));
      const gamesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched games:", gamesData);
      setGames(gamesData);
      setLoading(false); // Stop loading, når data er hentet
    } catch (error) {
      console.error("Error fetching games:", error);
      setLoading(false); // Stop loading, selvom der er en fejl
    }
  };

  const handleCompleteGame = async () => {
    if (!selectedGame || isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes >= 60) {
      alert("Please select a game and provide a valid time (hours and minutes).");
      return;
    }

    const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60; // Konverter til sekunder

    try {
      const username = localStorage.getItem("username"); // Hent brugernavn fra localStorage

      // Basispoint for placeringer (1. plads = 25, 2. plads = 18, osv.)
      const basePoints = [25, 18, 12, 10, 8, 6];

      // Tilføj resultatet til `gameResults`
      const resultRef = doc(db, "gameResults", `${selectedGame.id}_${username}`);
      await setDoc(resultRef, {
        gameId: selectedGame.id,
        username,
        time: totalSeconds,
        earnedPoints: 0, // Midlertidigt, opdateres senere
        timestamp: serverTimestamp(),
      });

      // Hent alle resultater for det specifikke spil
      const resultsSnapshot = await getDocs(collection(db, "gameResults"));
      const gameResults = resultsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((result) => result.gameId === selectedGame.id);

      // Sorter resultaterne efter tid (laveste tid først)
      gameResults.sort((a, b) => a.time - b.time);

      // Opdater `earnedPoints` og `totalPoints` for alle spillere baseret på deres placering
      for (let i = 0; i < gameResults.length; i++) {
        const playerResult = gameResults[i];
        const placementPoints = basePoints[i] || 0; // Hvis placeringen er uden for top 6, får man 0 point
        const updatedPoints = placementPoints * selectedGame.difficulty;

        // Beregn forskellen mellem de gamle og nye point
        const pointDifference = updatedPoints - (playerResult.earnedPoints || 0);

        // Opdater `earnedPoints` i Firestore
        const playerResultRef = doc(db, "gameResults", playerResult.id);
        await updateDoc(playerResultRef, {
          earnedPoints: updatedPoints,
        });

        // Opdater `totalPoints` i `users`
        const userRef = doc(db, "users", playerResult.username);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const totalPoints = typeof userData.totalPoints === "number" && !isNaN(userData.totalPoints)
            ? userData.totalPoints
            : 0;

          // Tilføj forskellen til brugerens samlede point
          const updatedTotalPoints = totalPoints + pointDifference;

          await updateDoc(userRef, {
            totalPoints: updatedTotalPoints,
          });

          console.log(`Updated total points for ${playerResult.username}: ${updatedTotalPoints}`);
        }
      }

      alert(`Game completed successfully! Your points have been updated.`);
      setSelectedGame(null);
      setHours("");
      setMinutes("");
    } catch (error) {
      console.error("Error completing game:", error);
      alert("Failed to complete game. Please try again.");
    }
  };

  return (
    <div className="complete-game-screen">
      <h1>Complete a Game</h1>
      {loading ? (
        <p>Loading games...</p>
      ) : games.length === 0 ? (
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
          {selectedGame && (
            <div>
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
              <button onClick={handleCompleteGame}>Complete Game</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CompleteGameScreen;