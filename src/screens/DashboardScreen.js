import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardScreen.css";

function DashboardScreen() {
  const [games, setGames] = useState([]); // Liste over spil
  const [newGame, setNewGame] = useState({ name: "", difficulty: 1 }); // Nyt spil
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  // Hent spil fra Firestore
  const fetchGames = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "games"));
      const gamesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(gamesData);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  // Tilføj nyt spil til Firestore
  const handleAddGame = async (e) => {
    e.preventDefault();

    if (!newGame.name || newGame.difficulty < 1 || newGame.difficulty > 10) {
      alert("Please provide a valid game name and difficulty (1-10).");
      return;
    }

    try {
      await addDoc(collection(db, "games"), {
        name: newGame.name,
        difficulty: newGame.difficulty,
      });
      alert("Game added successfully!");
      setNewGame({ name: "", difficulty: 1 }); // Nulstil formularen
      fetchGames(); // Opdater listen over spil
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  const handleViewLeaderboard = (gameId) => {
    navigate(`/leaderboard/${gameId}`);
  };

  return (
    <div className="dashboard-screen">

      {/* Tilføj nyt spil */}
      <div className="add-game">
        <h2>Add New Game</h2>
        <form onSubmit={handleAddGame}>
          <label>
            Game Name:
            <input
              type="text"
              value={newGame.name}
              onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
              required
            />
          </label>
          <label>
            Difficulty (1-10):
            <input
              type="number"
              value={newGame.difficulty}
              onChange={(e) =>
                setNewGame({ ...newGame, difficulty: parseInt(e.target.value) })
              }
              required
            />
          </label>
          <button type="submit">Add Game</button>
        </form>
      </div>

      {/* Liste over spil */}
      <div className="existing-games">
        <h2>Existing Games</h2>
        <table className="games-table">
          <thead>
            <tr>
              <th>Game Name</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td>{game.name}</td>
                <td>{game.difficulty}</td>
                <td>
                  <button
                    className="view-leaderboard-button"
                    onClick={() => handleViewLeaderboard(game.id)}
                  >
                    View Leaderboard
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardScreen;