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

      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        totalPoints: Number(doc.data().totalPoints || 0), // Sørg for, at totalPoints er et tal
      }));

      // Debugging: Log data for at sikre, at totalPoints findes og er et tal
      console.log("Fetched users:", usersData);

      // Sortér brugerne efter `totalPoints` i faldende rækkefølge
      const sortedUsers = usersData.sort((a, b) => b.totalPoints - a.totalPoints);

      // Debugging: Log sorteret data
      console.log("Sorted users:", sortedUsers);

      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching overall leaderboard:", error);
    }
  };

  return (
    <div className="main-content overall-leaderboard-screen">
      <h1>Overall Leaderboard</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OverallLeaderboardScreen;