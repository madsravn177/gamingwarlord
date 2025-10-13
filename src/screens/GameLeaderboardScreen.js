import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/GameLeaderboardScreen.css";

function GameLeaderboardScreen() {
  const { gameId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameName, setGameName] = useState("");

  // Helper: konverter sekunder til "xh ym zs" format (uden dage)
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
  
    let formatted = "";
    if (hours > 0) formatted += `${hours}h `;
    formatted += `${minutes}m`;
  
    return formatted;
  };
  

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const resultsRef = collection(db, "gameResults");
        const q = query(resultsRef, where("gameId", "==", gameId));
        const querySnapshot = await getDocs(q);

        const allResults = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sortér efter difficulty og tid
        allResults.sort((a, b) => {
          if (Number(b.difficulty) !== Number(a.difficulty)) {
            return Number(b.difficulty) - Number(a.difficulty);
          }
          return Number(a.time) - Number(b.time);
        });

        setResults(allResults);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchGameName = async () => {
      try {
        const gameDoc = await getDoc(doc(db, "games", gameId));
        if (gameDoc.exists()) {
          setGameName(gameDoc.data().name);
        }
      } catch (err) {
        console.error("Error fetching game name:", err);
      }
    };

    fetchGameName();
    fetchLeaderboard();
  }, [gameId]);

  return (
    <div className="main-content main-game-leaderboard-screen">
      <h1>{gameName ? `${gameName} Leaderboard` : "Game Leaderboard"}</h1>

      {loading && <p>Loading leaderboard...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p>No results found for this game.</p>
      )}

      {!loading && !error && results.length > 0 && (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Difficulty</th>
              <th>Time Played</th>
              <th>Earned Points</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.id}>
                <td>{index + 1}</td>
                <td>{result.username}</td>
                <td>{result.difficulty}</td>
                <td>{formatTime(result.time)}</td>
                <td>{result.earnedPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GameLeaderboardScreen;
