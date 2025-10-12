import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/GameLeaderboardScreen.css";

function GameLeaderboardScreen() {
  const { gameId } = useParams(); // Hent gameId fra URL'en
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log(`Fetching leaderboard for gameId: ${gameId}`);
        const resultsRef = collection(db, "gameResults"); // Brug den korrekte samling
        const q = query(resultsRef, where("gameId", "==", gameId)); // Filtrer på gameId
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched leaderboard data:", leaderboardData);
        setResults(leaderboardData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [gameId]);

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  if (results.length === 0) {
    return (
      <div className="no-data">
        <h2>No Results Found</h2>
        <p>There are currently no results for this game. Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="main-content game-leaderboard-screen">
      <h1>Game Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Points</th>
            <th>Difficulty</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.username}</td>
              <td>{(result.earnedPoints || 0)}</td>
              <td>{result.difficulty}</td>
              <td>{formatTime(result.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

export default GameLeaderboardScreen;