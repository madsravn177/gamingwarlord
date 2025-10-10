import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/LeaderboardScreen.css";

function LeaderboardScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => doc.data());

        // Log alle brugere for at debugge
        console.log("Fetched Users:", usersData);

        const filteredUsers = usersData
          .filter((user) => user.username.toLowerCase() !== "admin") // Fjern admin-brugeren baseret på username
          .sort((a, b) => b.score - a.score); // Sorter efter score

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="leaderboard-screen">
      <h1>Leaderboard</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {index + 1}. {user.username} - {user.score} points
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LeaderboardScreen;