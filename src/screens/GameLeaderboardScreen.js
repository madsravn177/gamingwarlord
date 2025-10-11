import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/GameLeaderboardScreen.css";

function GameLeaderboardScreen() {
  const { gameId } = useParams(); // Hent spillets ID fra URL'en
  const [results, setResults] = useState([]);
  const [gameName, setGameName] = useState("");

  const fetchLeaderboard = useCallback(async () => {
    try {
      const resultsRef = collection(db, "gameResults");
      const q = query(resultsRef, where("gameId", "==", gameId));
      const querySnapshot = await getDocs(q);

      const resultsData = querySnapshot.docs.map((doc) => doc.data());

      // Filtrer for kun at vise den bedste tid for hver bruger
      const bestResults = resultsData.reduce((acc, result) => {
        const existing = acc.find((r) => r.username === result.username);
        if (!existing || result.time < existing.time) {
          // Hvis der ikke er en eksisterende tid, eller den nye tid er bedre, opdater
          return acc.filter((r) => r.username !== result.username).concat(result);
        }
        return acc;
      }, []);

      const sortedResults = bestResults.sort((a, b) => a.time - b.time); // Sorter efter tid
      setResults(sortedResults);

      // Hent spillets navn
      const gameRef = collection(db, "games");
      const gameSnapshot = await getDocs(query(gameRef, where("id", "==", gameId)));
      if (!gameSnapshot.empty) {
        const gameData = gameSnapshot.docs[0].data();
        setGameName(gameData.name);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }, [gameId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Konverter tid fra sekunder til timer:minutter
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="game-leaderboard-screen">
      <h1>Leaderboard for {gameName}</h1>
      {results.length === 0 ? (
        <p>No results available for this game.</p>
      ) : (
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              {index + 1}. {result.username} - {formatTime(result.time)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GameLeaderboardScreen;