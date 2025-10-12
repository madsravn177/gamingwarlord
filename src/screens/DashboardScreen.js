import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardScreen.css";

function DashboardScreen() {
  const [games, setGames] = useState([]); // Liste over spil
  const [searchTerm, setSearchTerm] = useState(""); // Søgeterm
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

  // Filtrerede spil baseret på søgeterm
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content">
      <h1>Game List</h1>
      <input
        type="text"
        placeholder="Search for a game..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="games-grid">
        {filteredGames.length === 0 ? (
          <p>No games found.</p>
        ) : (
          filteredGames.map((game) => (
            <div key={game.id} className="game-card">
              <h3>{game.name}</h3>
              <p>Difficulty: {game.difficulty}</p>
              <button onClick={() => navigate(`/leaderboard/${game.id}`)}>
                View Leaderboard
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardScreen;