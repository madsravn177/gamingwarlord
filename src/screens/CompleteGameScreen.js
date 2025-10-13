import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/CompleteGameScreen.css";

function CompleteGameScreen() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(1); // Standard sværhedsgrad
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
      alert("Please select a game, difficulty, and provide a valid time (hours and minutes).");
      return;
    }
  
    const totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
    const username = localStorage.getItem("username");
  
    const basePoints = [25, 18, 12, 10, 8, 6]; // Top 6 får points
  
    try {
      console.log("🎮 Starting game completion flow...");
  
      // Hent alle resultater for det specifikke spil
      const resultsSnapshot = await getDocs(collection(db, "gameResults"));
      let gameResults = resultsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((result) => result.gameId === selectedGame.id);
  
      // Find eksisterende resultat for brugeren (hvis det findes)
      const existingResult = gameResults.find((r) => r.username === username);
      const newResultId = `${selectedGame.id}_${username}_${selectedDifficulty}`;
  
      if (existingResult) {
        const resultRef = doc(db, "gameResults", existingResult.id);
        const resultDoc = await getDoc(resultRef);
  
        if (resultDoc.exists()) {
          const resultData = resultDoc.data();
  
          if (selectedDifficulty > resultData.difficulty || totalSeconds < resultData.time) {
            await updateDoc(resultRef, {
              difficulty: selectedDifficulty,
              time: totalSeconds,
              timestamp: serverTimestamp(),
            });
            console.log(`✅ Updated existing result for ${username}`);
          } else {
            alert("You have not improved your score or difficulty. No changes made.");
            return;
          }
        }
      } else {
        // Nyt resultat → ingen point endnu
        const resultRef = doc(db, "gameResults", newResultId);
        await setDoc(resultRef, {
          gameId: selectedGame.id,
          username,
          difficulty: selectedDifficulty,
          time: totalSeconds,
          earnedPoints: 0,
          timestamp: serverTimestamp(),
        });
        console.log(`🆕 Created new result for ${username}`);
      }
  
      // Hent friske data igen efter opdatering
      const updatedResultsSnapshot = await getDocs(collection(db, "gameResults"));
      gameResults = updatedResultsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((result) => result.gameId === selectedGame.id);
  
      // Sortér korrekt efter difficulty (desc) og tid (asc)
      gameResults.sort((a, b) => {
        if (b.difficulty !== a.difficulty) return b.difficulty - a.difficulty;
        return a.time - b.time;
      });
  
      console.table(
        gameResults.map((r, i) => ({
          rank: i + 1,
          username: r.username,
          difficulty: r.difficulty,
          time: r.time,
        }))
      );
  
      // Opdater earnedPoints baseret på sortering
      for (let i = 0; i < gameResults.length; i++) {
        const player = gameResults[i];
        const rankPoints = basePoints[i] || 0;
        const earnedPoints = rankPoints * player.difficulty;
  
        console.log(
          `🏅 Rank ${i + 1}: ${player.username} | Diff: ${player.difficulty} | Points: ${earnedPoints}`
        );
  
        const playerRef = doc(db, "gameResults", player.id);
        await updateDoc(playerRef, { earnedPoints });
      }
  
      // 🧮 Nu skal vi opdatere totalPoints i users
      console.log("🔄 Recalculating total points for all users...");
  
      const allResultsSnapshot = await getDocs(collection(db, "gameResults"));
      const allResults = allResultsSnapshot.docs.map((doc) => doc.data());
  
      // Beregn totalPoints pr. bruger
      const userTotals = {};
      for (const result of allResults) {
        if (!userTotals[result.username]) userTotals[result.username] = 0;
        userTotals[result.username] += result.earnedPoints || 0;
      }
  
      console.table(
        Object.entries(userTotals).map(([username, totalPoints]) => ({
          username,
          totalPoints,
        }))
      );
  
      // Opdater eller opret users i Firestore
      for (const [username, totalPoints] of Object.entries(userTotals)) {
        const userDocRef = doc(db, "users", username); // <--- forudsætter username = doc ID
        await updateDoc(userDocRef, { totalPoints }).catch(async () => {
          await setDoc(userDocRef, { username, totalPoints });
        });
      }
  
      console.log("✅ Updated totalPoints in users collection!");
  
      alert("✅ Game completed and points updated!");
      setSelectedGame(null);
      setSelectedDifficulty(1);
      setHours("");
      setMinutes("");
    } catch (error) {
      console.error("❌ Error completing game:", error);
      alert("Failed to complete game. Please try again.");
    }
  };
  
  

  return (
    <div className="main-content complete-game-screen">
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
                {game.name}
              </option>
            ))}
          </select>
          {selectedGame && (
            <div>
              <label htmlFor="difficulty">Select Difficulty:</label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
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
              <button onClick={handleCompleteGame}>Complete Game</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CompleteGameScreen;