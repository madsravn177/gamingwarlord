import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/LeaderboardScreen.css";

function LeaderboardScreen() {
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
      }));
      const sortedUsers = usersData.sort((a, b) => b.totalPoints - a.totalPoints); // Sorter efter samlede point
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching overall leaderboard:", error);
    }
  };

  // Nulstil alle brugeres point
  const resetPoints = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      const resetPromises = querySnapshot.docs.map((userDoc) => {
        const userRef = doc(db, "users", userDoc.id);
        return updateDoc(userRef, { totalPoints: 0 });
      });

      await Promise.all(resetPromises);
      alert("All points have been reset!");
      fetchOverallLeaderboard(); // Opdater leaderboardet
    } catch (error) {
      console.error("Error resetting points:", error);
    }
  };

  return (
    <div className="leaderboard-screen">
      <h1>Overall Leaderboard</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={user.id}>
              {index + 1}. {user.username} - {user.totalPoints} points
            </li>
          ))}
        </ul>
      )}

      {/* Nulstil point-knap */}
      <button onClick={resetPoints} className="reset-button">
        Reset All Points
      </button>
    </div>
  );
}

export default LeaderboardScreen;