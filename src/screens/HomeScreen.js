import React, { useEffect, useState } from "react";
import "../styles/HomeScreen.css";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function HomeScreen() {
  const username = localStorage.getItem("username");
  const [warlord, setWarlord] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // Hent den nuværende nummer 1 på Overall Leaderboard
  useEffect(() => {
    const fetchWarlord = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("totalPoints", "desc"), limit(1)); // Sorter efter totalPoints og hent den øverste
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const topUser = querySnapshot.docs[0].data();
          setWarlord(topUser);
        }
      } catch (error) {
        console.error("Error fetching the current warlord:", error);
      }
    };

    fetchWarlord();
  }, []);

  // Hent de sidste 5 gennemførte spil
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const resultsRef = collection(db, "gameResults");
        const q = query(resultsRef, orderBy("timestamp", "desc"), limit(5)); // Sorter efter timestamp og hent de seneste 5
        const querySnapshot = await getDocs(q);

        const activities = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecentActivities(activities);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };

    fetchRecentActivities();
  }, []);

  // Konverter tid fra sekunder til timer:minutter
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="home-screen">
      <h1>Welcome, {username}!</h1>
      {warlord ? (
        <div className="warlord-section">
          <h2>Current Gaming Warlord</h2>
          <p>
            <strong>{warlord.username}</strong> with <strong>{warlord.totalPoints}</strong> points!
          </p>
        </div>
      ) : (
        <p>Loading current Gaming Warlord...</p>
      )}

      <div className="recent-activities-section">
        <h2>De sidste 5 gennemførte spil</h2>
        {recentActivities.length === 0 ? (
          <p>Ingen gennemførte spil fundet.</p>
        ) : (
          <ul>
            {recentActivities.map((activity) => (
              <li key={activity.id}>
                <strong>Game:</strong> {activity.gameName || "Unknown Game"} -{" "}
                <strong>Time:</strong> {formatTime(activity.time)} -{" "}
                <strong>Completed by:</strong> {activity.username}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;