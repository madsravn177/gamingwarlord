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
      // Hent alle spil
      const gamesSnapshot = await getDocs(collection(db, "games"));
      const gamesData = gamesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Hent alle resultater
      const resultsSnapshot = await getDocs(collection(db, "gameResults"));
      const resultsData = resultsSnapshot.docs.map((doc) => doc.data());

      // Match resultater med spilnavne og beregn point
      const combinedData = resultsData.map((result) => {
        const game = gamesData.find((g) => g.id === result.gameId);
        const difficulty = game ? game.difficulty : 1;

        // Beregn point baseret på placering
        const basePoints = [25, 18, 12, 10, 8, 6]; // Point for placeringer
        const placement = resultsData
          .filter((r) => r.gameId === result.gameId)
          .sort((a, b) => a.time - b.time)
          .findIndex((r) => r.username === result.username) + 1;
        const points = basePoints[placement - 1] ? basePoints[placement - 1] * difficulty : 0;

        return {
          ...result,
          gameName: game ? game.name : "Unknown Game",
          points,
        };
      });

      setCompletedGames(combinedData);
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
        <ul>
          {completedGames.map((game, index) => (
            <li key={index}>
              <strong>Game:</strong> {game.gameName} - <strong>Time:</strong> {formatTime(game.time)} - <strong>Points:</strong> {game.points} - <strong>Completed by:</strong> {game.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserCompletedGamesScreen;