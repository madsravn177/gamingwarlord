import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/OverallLeaderboardScreen.css";

function OverallLeaderboardScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchOverallLeaderboard();
  }, []);

  // Hent det samlede leaderboard fra Firestore
  const fetchOverallLeaderboard = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      const usersData = querySnapshot.docs.map((doc) => doc.data());
      const sortedUsers = usersData.sort((a, b) => b.totalPoints - a.totalPoints); // Sorter efter samlede point
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching overall leaderboard:", error);
    }
  };

  return (
    <div className="overall-leaderboard-screen">
      <h1>Overall Leaderboard</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {index + 1}. {user.username} - {user.totalPoints} points
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OverallLeaderboardScreen;