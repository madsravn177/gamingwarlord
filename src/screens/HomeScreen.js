import React, { useEffect, useState } from "react";
import "../styles/HomeScreen.css";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function HomeScreen() {
  const username = localStorage.getItem("username");
  const [warlord, setWarlord] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // Hent den nuværende Gaming Warlord
  useEffect(() => {
    const fetchWarlord = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("score", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const topUser = querySnapshot.docs[0].data();
        setWarlord(topUser);
      }
    };

    fetchWarlord();
  }, []);

  // Hent brugerens seneste aktiviteter
  useEffect(() => {
    const fetchRecentActivities = async () => {
      const activitiesRef = collection(db, "activities"); // Antager, at du har en "activities"-collection
      const q = query(activitiesRef, orderBy("timestamp", "desc"), limit(5));
      const querySnapshot = await getDocs(q);

      const activities = querySnapshot.docs.map((doc) => doc.data());
      setRecentActivities(activities);
    };

    fetchRecentActivities();
  }, []);

  return (
    <div className="home-screen">
      <h1>Welcome, {username}!</h1>
      <p>Select a page from the navigation bar above.</p>

      {/* Gaming Warlord Sektion */}
      <div className="warlord-section">
        <h2>Current Gaming Warlord</h2>
        {warlord ? (
          <div>
            <p>
              <strong>{warlord.username}</strong> with <strong>{warlord.score}</strong> points!
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Seneste aktiviteter */}
      <div className="recent-activities">
        <h2>Your Recent Activities</h2>
        {recentActivities.length > 0 ? (
          <ul>
            {recentActivities.map((activity, index) => (
              <li key={index}>
                {activity.description} - {new Date(activity.timestamp?.toDate()).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent activities found.</p>
        )}
      </div>

      {/* Hurtige links */}
      <div className="quick-links">
        <h2>Quick Links</h2>
        <ul>
          <li>
            <a href="/leaderboard">View Leaderboard</a>
          </li>
          <li>
            <a href="/dashboard">Go to Dashboard</a>
          </li>
          <li>
            <a href="/gamepool">Explore Game Pool</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HomeScreen;