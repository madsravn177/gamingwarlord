import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/UserCompletedGamesScreen.css";

function UserCompletedGamesScreen() {
  const [completedGames, setCompletedGames] = useState([]);

  useEffect(() => {
    fetchCompletedGames();
  }, []);

  // Hent alle gennemførte spil og match med spilnavne
  const fetchCompletedGames = async () => {
    try {
      // Hent alle spil fra `games`-collectionen
      const gamesSnapshot = await getDocs(collection(db, "games"));
      const gamesData = gamesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Hent alle resultater fra `gameResults`-collectionen
      const resultsSnapshot = await getDocs(collection(db, "gameResults"));
      const resultsData = resultsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Match resultater med spilnavne og beregn point
      const combinedData = resultsData.map((result) => {
        const game = gamesData.find((g) => g.id === result.gameId);
        const difficulty = game ? game.difficulty : 1;

        // Beregn point, hvis de ikke allerede er gemt i resultaterne
        const basePoints = [25, 18, 12, 10, 8, 6];
        const placement = resultsData
          .filter((r) => r.gameId === result.gameId)
          .sort((a, b) => a.time - b.time)
          .findIndex((r) => r.username === result.username) + 1;
        const calculatedPoints = basePoints[placement - 1]
          ? basePoints[placement - 1] * difficulty
          : 0;

        return {
          ...result,
          gameName: game ? game.name : "Unknown Game",
          points: result.points || calculatedPoints, // Brug `points` fra resultaterne eller beregn dem
        };
      });

      // Sortér spillene efter timestamp i faldende rækkefølge (seneste først)
      const sortedGames = combinedData.sort((a, b) => b.timestamp - a.timestamp);

      setCompletedGames(sortedGames);
    } catch (error) {
      console.error("Error fetching completed games:", error);
    }
  };

  // Konverter tid fra sekunder til timer:minutter
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="user-completed-games-screen">
      <h1>All Completed Games</h1>
      {completedGames.length === 0 ? (
        <p>No games have been completed yet.</p>
      ) : (
        <table className="completed-games-table">
          <thead>
            <tr>
              <th>Game</th>
              <th>Time</th>
              <th>Points</th>
              <th>Completed By</th>
            </tr>
          </thead>
          <tbody>
            {completedGames.map((game, index) => (
              <tr key={index}>
                <td>{game.gameName}</td>
                <td>{formatTime(game.time)}</td>
                <td>{game.points}</td>
                <td>{game.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserCompletedGamesScreen;