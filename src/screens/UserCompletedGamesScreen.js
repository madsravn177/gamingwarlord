import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/UserCompletedGamesScreen.css";

function UserCompletedGamesScreen() {
  const [completedGames, setCompletedGames] = useState([]);
  const [showOnlyMyGames, setShowOnlyMyGames] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchCompletedGames();
  }, []);

  const fetchCompletedGames = async () => {
    try {
      setLoading(true);
      setError(null);

      const resultsSnapshot = await getDocs(collection(db, "gameResults"));
      const resultsData = resultsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const gamesSnapshot = await getDocs(collection(db, "games"));
      const gamesData = gamesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const completedGamesWithNames = resultsData.map((result) => {
        const game = gamesData.find((g) => g.id === result.gameId);
        return {
          ...result,
          gameName: game ? game.name : "Unknown Game",
          points: result.earnedPoints || 0,
        };
      });

      setCompletedGames(completedGamesWithNames);
    } catch (err) {
      console.error("Error fetching completed games:", err);
      setError("Failed to fetch completed games.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompletedGame = async (gameId, completedBy) => {
    if (username !== "Ravn") {
      alert("You do not have permission to delete this game.");
      return;
    }

    try {
      const resultRef = doc(db, "gameResults", gameId);
      const resultDoc = await getDoc(resultRef);

      if (!resultDoc.exists()) {
        alert("Game result not found.");
        return;
      }

      const { earnedPoints } = resultDoc.data();
      const validGamePoints = typeof earnedPoints === "number" && !isNaN(earnedPoints) ? earnedPoints : 0;

      await deleteDoc(resultRef);

      const userRef = doc(db, "users", completedBy);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const totalPoints = typeof userData.totalPoints === "number" && !isNaN(userData.totalPoints)
          ? userData.totalPoints
          : 0;
        const updatedPoints = Math.max(totalPoints - validGamePoints, 0);

        await updateDoc(userRef, { totalPoints: updatedPoints });
      }

      alert("Completed game deleted successfully!");
      fetchCompletedGames();
    } catch (err) {
      console.error("Error deleting completed game:", err);
      alert("Failed to delete completed game. Please try again.");
    }
  };

  const filteredGames = showOnlyMyGames
    ? completedGames.filter((game) => game.username === username)
    : completedGames;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="main-content user-completed-games-screen">
      <h1>Completed Games</h1>

      <div className="filter-container">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showOnlyMyGames}
            onChange={(e) => setShowOnlyMyGames(e.target.checked)}
          />
          Show only my completed games
        </label>
      </div>

      {loading ? (
        <p>Loading completed games...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredGames.length === 0 ? (
        <p className="no-games-message">No completed games found.</p>
      ) : (
        <div className="completed-games-list">
          {filteredGames.map((game) => (
            <div key={game.id} className="completed-game-card">
              <h3>{game.gameName || "Unknown Game"}</h3>
              <p>Time: {formatTime(game.time)}</p>
              <p>Points: {game.points || 0}</p>
              <p>Completed By: {game.username}</p>
              {username === "Ravn" && (
                <button onClick={() => handleDeleteCompletedGame(game.id, game.username)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserCompletedGamesScreen;
