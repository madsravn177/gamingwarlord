import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/DashboardScreen.css";

function DashboardScreen() {
  const [games, setGames] = useState([]); // Liste over spil
  const [newGame, setNewGame] = useState({ name: "", difficulty: 1 }); // Nyt spil
  const [selectedGame, setSelectedGame] = useState(null); // Valgt spil til redigering
  const [editedGame, setEditedGame] = useState({ name: "", difficulty: 0 }); // Redigeret spil
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal til redigering

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

  // Tilføj nyt spil
  const handleAddGame = async () => {
    if (!newGame.name || newGame.difficulty < 1 || newGame.difficulty > 10) {
      alert("Please provide a valid game name and difficulty (1-10).");
      return;
    }

    try {
      const newGameData = {
        name: newGame.name,
        difficulty: newGame.difficulty,
        points: newGame.difficulty, // Points er lig med sværhedsgraden
      };

      await addDoc(collection(db, "games"), newGameData);
      alert("Game added successfully!");
      setNewGame({ name: "", difficulty: 1 }); // Nulstil inputfelter
      fetchGames(); // Opdater listen over spil
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  // Åbn modal til redigering
  const openEditModal = (game) => {
    setSelectedGame(game);
    setEditedGame({ name: game.name, difficulty: game.difficulty });
    setIsModalOpen(true);
  };

  // Luk modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  // Gem ændringer til spil
  const saveGameChanges = async () => {
    if (!selectedGame) return;

    try {
      const gameRef = doc(db, "games", selectedGame.id);
      await updateDoc(gameRef, {
        name: editedGame.name,
        difficulty: editedGame.difficulty,
        points: editedGame.difficulty, // Points opdateres til at matche sværhedsgraden
      });
      alert("Game updated successfully!");
      closeModal();
      fetchGames(); // Opdater listen over spil
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  // Slet spil
  const deleteGame = async (gameId) => {
    try {
      const gameRef = doc(db, "games", gameId);
      await deleteDoc(gameRef);
      alert("Game deleted successfully!");
      fetchGames(); // Opdater listen over spil
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  return (
    <div className="dashboard-screen">
      <h1>Dashboard</h1>

      {/* Tilføj nyt spil */}
      <div className="add-game">
        <h2>Add New Game</h2>
        <label>
          Name:
          <input
            type="text"
            value={newGame.name}
            onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
          />
        </label>
        <label>
          Difficulty (1-10):
          <input
            type="number"
            value={newGame.difficulty}
            onChange={(e) => setNewGame({ ...newGame, difficulty: parseInt(e.target.value) })}
          />
        </label>
        <button onClick={handleAddGame}>Add Game</button>
      </div>

      {/* Liste over spil */}
      <div className="game-list">
        <h2>Existing Games</h2>
        {games.length === 0 ? (
          <p>No games available.</p>
        ) : (
          <ul>
            {games.map((game) => (
              <li key={game.id}>
                <strong>{game.name}</strong> - Difficulty: {game.difficulty} - Points: {game.points}
                <button onClick={() => openEditModal(game)}>Edit</button>
                <button onClick={() => deleteGame(game.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal til redigering */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Game</h2>
            <label>
              Name:
              <input
                type="text"
                value={editedGame.name}
                onChange={(e) => setEditedGame({ ...editedGame, name: e.target.value })}
              />
            </label>
            <label>
              Difficulty:
              <input
                type="number"
                value={editedGame.difficulty}
                onChange={(e) => setEditedGame({ ...editedGame, difficulty: parseInt(e.target.value) })}
              />
            </label>
            <button onClick={saveGameChanges}>Save</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardScreen;