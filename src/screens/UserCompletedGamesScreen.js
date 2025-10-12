import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/UserCompletedGamesScreen.css";

function UserCompletedGamesScreen() {
  const [completedGames, setCompletedGames] = useState([]);
  const [showOnlyMyGames, setShowOnlyMyGames] = useState(false); // Afkrydsningsfeltets tilstand
  const username = localStorage.getItem("username"); // Hent brugernavn fra localStorage

  useEffect(() => {
    fetchCompletedGames();
  }, []);

  const fetchCompletedGames = async () => {
    try {
      // Hent gennemførte spil fra `gameResults`
      const resultsSnapshot = await getDocs(collection(db, "gameResults"));
      const resultsData = resultsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Hent spilnavne fra `games`
      const gamesSnapshot = await getDocs(collection(db, "games"));
      const gamesData = gamesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Match spilnavne med `gameId` i `gameResults`
      const completedGamesWithNames = resultsData.map((result) => {
        const game = gamesData.find((g) => g.id === result.gameId);
        return {
          ...result,
          gameName: game ? game.name : "Unknown Game", // Tilføj spilnavn eller "Unknown Game"
          points: result.earnedPoints || 0, // Brug `earnedPoints` fra `gameResults`
        };
      });

      setCompletedGames(completedGamesWithNames);
    } catch (error) {
      console.error("Error fetching completed games:", error);
    }
  };

  const handleDeleteCompletedGame = async (gameId, completedBy) => {
    if (username !== "Ravn") {
      alert("You do not have permission to delete this game.");
      return;
    }

    try {
      // Hent det slettede spil fra `gameResults`
      const resultRef = doc(db, "gameResults", gameId);
      const resultDoc = await getDoc(resultRef);

      if (!resultDoc.exists()) {
        alert("Game result not found.");
        return;
      }

      const { earnedPoints } = resultDoc.data(); // Hent pointene for det slettede spil

      // Sikring mod NaN: Hvis earnedPoints ikke er et tal, sæt det til 0
      const validGamePoints = typeof earnedPoints === "number" && !isNaN(earnedPoints) ? earnedPoints : 0;

      // Slet resultatet fra `gameResults`
      await deleteDoc(resultRef);

      // Opdater brugerens samlede point
      const userRef = doc(db, "users", completedBy);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const totalPoints = typeof userData.totalPoints === "number" && !isNaN(userData.totalPoints)
          ? userData.totalPoints
          : 0;

        // Træk kun pointene for det slettede spil fra
        const updatedPoints = Math.max(totalPoints - validGamePoints, 0);

        // Opdater `totalPoints` i Firestore
        await updateDoc(userRef, {
          totalPoints: updatedPoints,
        });

        console.log(`Updated total points for ${completedBy}: ${updatedPoints}`);
      } else {
        console.error("User document not found.");
      }

      alert("Completed game deleted successfully!");
      fetchCompletedGames(); // Opdater listen over gennemførte spil
    } catch (error) {
      console.error("Error deleting completed game:", error);
      alert("Failed to delete completed game. Please try again.");
    }
  };

  // Filtrerede spil baseret på afkrydsningsfeltets tilstand
  const filteredGames = showOnlyMyGames
    ? completedGames.filter((game) => game.username === username)
    : completedGames;

  return (
    <div className="user-completed-games-screen">
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
      <div className="completed-games-list">
        {filteredGames.length === 0 ? (
          <p>No completed games found.</p>
        ) : (
          filteredGames.map((game) => (
            <div key={game.id} className="completed-game-card">
              <h3>{game.gameName || "Unknown Game"}</h3>
              <p>
                Time: {Math.floor(game.time / 3600)}h{" "}
                {Math.floor((game.time % 3600) / 60)}m
              </p>
              <p>Points: {game.points || 0}</p>
              <p>Completed By: {game.username}</p>
              {username === "Ravn" && (
                <button
                  onClick={() =>
                    handleDeleteCompletedGame(game.id, game.username)
                  }
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserCompletedGamesScreen;