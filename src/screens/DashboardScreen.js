import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardScreen.css";
import { debounce } from "lodash";

function DashboardScreen() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ useMemo so debounce is created once and ESLint is happy
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
      }, 500),
    []
  );

  // Fetch games from Firestore
  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, "games"));
      const gamesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(gamesData);
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Failed to load games. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();

    // Cleanup debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="main-content">
      <h1>Game List</h1>

      <input
        type="text"
        placeholder="Search for a game..."
        defaultValue={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      <button
        onClick={fetchGames}
        disabled={loading}
        className="refresh-button"
      >
        {loading ? "Refreshing..." : "Refresh List"}
      </button>

      {loading && !error && <div className="loading-spinner">Loading...</div>}
      {error && <p className="error-message">{error}</p>}

      {filteredGames.length === 0 && !loading && !error ? (
        <p>No games found. Try searching with a different term.</p>
      ) : (
        <div className="games-grid">
          {filteredGames.map((game) => (
            <div key={game.id} className="game-card">
              <h3>{game.name}</h3>
              {game.difficulty && <p>Difficulty: {game.difficulty}</p>}
              <button onClick={() => navigate(`/leaderboard/${game.id}`)}>
                View Leaderboard
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardScreen;
