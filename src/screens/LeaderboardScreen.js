import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/LeaderboardScreen.css";

function LeaderboardScreen() {
  const [users, setUsers] = useState([]);
  const username = localStorage.getItem("username"); // Hent brugernavn fra localStorage

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.username.toLowerCase() !== "admin"); // Fjern Admin-brugeren

        const sortedUsers = usersData.sort((a, b) => b.score - a.score); // Sorter efter score
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Nulstil alle brugeres point
  const resetPoints = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const batchPromises = querySnapshot.docs.map((userDoc) => {
        const userRef = doc(db, "users", userDoc.id);
        return updateDoc(userRef, { score: 0 });
      });

      await Promise.all(batchPromises);
      alert("All points have been reset!");
      window.location.reload(); // Genindlæs siden for at opdatere leaderboardet
    } catch (error) {
      console.error("Error resetting points:", error);
    }
  };

  return (
    <div className="leaderboard-screen">
      <h1>Leaderboard</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={user.id}>
              {index + 1}. {user.username} - {user.score} points
            </li>
          ))}
        </ul>
      )}

      {/* Vis nulstillingsknappen kun for Admin */}
      {username === "Admin" && (
        <button onClick={resetPoints} className="reset-button">
          Reset All Points
        </button>
      )}
    </div>
  );
}

export default LeaderboardScreen;