import React, { useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/AddGameScreen.css";

function AddGameScreen() {
  const [newGameName, setNewGameName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddGame = async (e) => {
    e.preventDefault();

    // Nulstil beskeder
    setMessage("");
    setError("");

    // Simpel validering
    if (!newGameName.trim()) {
      setError("Indtast venligst et gyldigt spilnavn.");
      return;
    }

    setLoading(true);

    try {
      const gamesRef = collection(db, "games");

      // Tjek for dubletter (case-insensitive)
      const q = query(
        gamesRef,
        where("name", "==", newGameName.trim())
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setError("Dette spil findes allerede.");
        setLoading(false);
        return;
      }

      // Tilføj nyt spil
      await addDoc(gamesRef, { name: newGameName.trim() });

      setMessage("Spillet blev tilføjet succesfuldt!");
      setNewGameName("");
    } catch (err) {
      console.error("Fejl ved tilføjelse af spil:", err);
      setError("Der opstod en fejl. Prøv igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content add-game-screen">
      <h1>Tilføj et nyt spil</h1>

      <form onSubmit={handleAddGame}>
        <input
          type="text"
          placeholder="Spilnavn"
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Tilføjer..." : "Tilføj spil"}
        </button>
      </form>

      {/* Feedback-beskeder */}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default AddGameScreen;
