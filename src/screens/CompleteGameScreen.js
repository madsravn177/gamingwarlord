import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/CompleteGameScreen.css";

function CompleteGameScreen() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // To show success/error messages

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
      setGames(gamesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching games:", error);
      setLoading(false);
      setMessage("Error fetching games. Please try again.");
    }
  };

  const validateInputs = () => {
    if (!selectedGame || isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes >= 60) {
      setMessage("Please select a game, difficulty, and provide valid time (hours and minutes).");
      return false;
    }
    return true;
  };

  const handleCompleteGame = async () => {
    if (!validateInputs()) return;

    const totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
    const username = localStorage.getItem("username");
    const basePoints = [25, 18, 12, 10, 8, 6];

    try {
      console.log("🎮 Starting game completion flow...");
      const resultsSnapshot = await getDocs(collection(db, "gameResults"));
      let gameResults = resultsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((result) => result.gameId === selectedGame.id);

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
            setMessage("✅ Your game result has been updated!");
          } else {
            setMessage("You have not improved your score or difficulty. No changes made.");
            return;
          }
        }
      } else {
        const resultRef = doc(db, "gameResults", newResultId);
        await setDoc(resultRef, {
          gameId: selectedGame.id,
          username,
          difficulty: selectedDifficulty,
          time: totalSeconds,
          earnedPoints: 0,
          timestamp: serverTimestamp(),
        });
        setMessage("🆕 New game result created!");
      }

      const updatedResultsSnapshot = await getDocs(collection(db, "gameResults"));
      gameResults = updatedResultsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((result) => result.gameId === selectedGame.id);

      gameResults.sort((a, b) => {
        if (b.difficulty !== a.difficulty) return b.difficulty - a.difficulty;
        return a.time - b.time;
      });

      for (let i = 0; i < gameResults.length; i++) {
        const player = gameResults[i];
        const rankPoints = basePoints[i] || 0;
        const earnedPoints = rankPoints * player.difficulty;

        const playerRef = doc(db, "gameResults", player.id);
        await updateDoc(playerRef, { earnedPoints });
      }

      const allResultsSnapshot = await getDocs(collection(db, "gameResults"));
      const allResults = allResultsSnapshot.docs.map((doc) => doc.data());

      const userTotals = {};
      for (const result of allResults) {
        if (!userTotals[result.username]) userTotals[result.username] = 0;
        userTotals[result.username] += result.earnedPoints || 0;
      }

      for (const [username, totalPoints] of Object.entries(userTotals)) {
        const userDocRef = doc(db, "users", username);
        await updateDoc(userDocRef, { totalPoints }).catch(async () => {
          await setDoc(userDocRef, { username, totalPoints });
        });
      }

      setMessage("✅ Game completed and points updated!");
      setSelectedGame(null);
      setSelectedDifficulty(1);
      setHours("");
      setMinutes("");
    } catch (error) {
      console.error("❌ Error completing game:", error);
      setMessage("Failed to complete game. Please try again.");
    }
  };

  return (
    <div className="main-content complete-game-screen">
      <h1>Complete a Game</h1>
      {loading ? (
        <p className="loading-message">Loading games...</p>
      ) : games.length === 0 ? (
        <p className="no-games-message">No games available.</p>
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

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default CompleteGameScreen;
