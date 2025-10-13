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
    
        const resultsRef = collection(db, "gameResults"); // Brug den korrekte samling
        const q = query(resultsRef, where("gameId", "==", gameId)); // Filtrer på gameId
        const querySnapshot = await getDocs(q);
        const allResults = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sortér resultaterne efter sværhedsgrad og tid
        allResults.sort((a, b) => {
          if (Number(b.difficulty) !== Number(a.difficulty)) {
            return Number(b.difficulty) - Number(a.difficulty); // Prioriter højere sværhedsgrad
          }
          return Number(a.time) - Number(b.time); // Hvis sværhedsgraden er ens, prioriter lavere tid
        });

        setResults(allResults);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [gameId]);

  return (
    <div className="main-content main-game-leaderboard-screen">
      <h1>Game Leaderboard</h1>
      {loading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Difficulty</th>
              <th>Time</th>
              <th>Earned Points</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.id}>
                <td>{index + 1}</td>
                <td>{result.username}</td>
                <td>{result.difficulty}</td>
                <td>{result.time}s</td>
                <td>{result.earnedPoints}</td> {/* Viser earnedPoints */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GameLeaderboardScreen;