import React, { useEffect, useState } from "react";
import "../styles/HomeScreen.css";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function HomeScreen() {
  const username = localStorage.getItem("username");

  const [warlord, setWarlord] = useState(null);
  const [loadingWarlord, setLoadingWarlord] = useState(true);
  const [errorWarlord, setErrorWarlord] = useState(null);

  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorActivities, setErrorActivities] = useState(null);

  // Hent den nuværende nummer 1 på Overall Leaderboard
  useEffect(() => {
    const fetchWarlord = async () => {
      try {
        setLoadingWarlord(true);
        setErrorWarlord(null);

        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("totalPoints", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const topUser = querySnapshot.docs[0].data();
          setWarlord(topUser);
        }
      } catch (error) {
        console.error("Error fetching the current warlord:", error);
        setErrorWarlord("Failed to fetch current Gaming Warlord.");
      } finally {
        setLoadingWarlord(false);
      }
    };

    fetchWarlord();
  }, []);

  // Hent de sidste 5 gennemførte spil
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoadingActivities(true);
        setErrorActivities(null);

        const gamesSnapshot = await getDocs(collection(db, "games"));
        const gamesData = gamesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const resultsRef = collection(db, "gameResults");
        const q = query(resultsRef, orderBy("timestamp", "desc"), limit(5));
        const querySnapshot = await getDocs(q);

        const activities = querySnapshot.docs.map((doc) => {
          const result = doc.data();
          const game = gamesData.find((g) => g.id === result.gameId);
          return {
            ...result,
            gameName: game ? game.name : "Unknown Game",
          };
        });

        setRecentActivities(activities);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
        setErrorActivities("Failed to fetch recent activities.");
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchRecentActivities();
  }, []);

  // Konverter tid fra sekunder til timer:minutter, uden 0h
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="home-screen">
      <h1>Welcome, {username}!</h1>

      {/* Warlord Section */}
      {loadingWarlord ? (
        <p>Loading current Gaming Warlord...</p>
      ) : errorWarlord ? (
        <p className="error-message">{errorWarlord}</p>
      ) : warlord ? (
        <div className="warlord-section card">
          <h2>Current Gaming Warlord</h2>
          <p>
            <strong>{warlord.username}</strong> with <strong>{warlord.totalPoints}</strong> points!
          </p>
        </div>
      ) : null}

<div className="difficulty-rules-box card">
  <h3>Regler for valg af sværhedsgrad</h3>
  <p>Når du vælger sværhedsgrad for et spil, kan du følge disse retningslinjer:</p>
  <ul>
    <li>Sværhedsgrad går fra <strong>1 (lettest)</strong> til <strong>10 (sværest)</strong>.</li>
    <li>Sværhedsgraden er fastlagt objektivt via ChatGPT med en standardprompt, så den er <strong>ens for alle spillere</strong>.</li>
    <li>Højere sværhedsgrad giver flere point, men spillet bliver også mere udfordrende.</li>
    <li>Du kan kun <strong>opdatere dit resultat</strong>, hvis du forbedrer tiden eller sværhedsgraden.</li>
    <li>Vælg en sværhedsgrad, der passer til dit niveau og dine mål.</li>
    <li>Planlæg din tid – sværere spil kan tage længere tid at gennemføre.</li>
  </ul>
</div>


    {/* Points & Difficulty Info Box */}
    <div className="multiplier-info-box card">
  <h3>Point & Sværhedsgrad</h3>
  <p><strong>Pointene beregnes ud fra din rank på spillets leaderboard:</strong></p>
  <p>Rank 1 → 25 point</p>
  <p>Rank 2 → 18 point</p>
  <p>Rank 3 → 12 point</p>
  <p>Rank 4 → 10 point</p>
  <p>Rank 5 → 8 point</p>
  <p>Rank 6 → 6 point</p>
  <p>Rank 7 eller lavere → 0 point</p>
  <p>Disse base points ganges med den valgte sværhedsgrad for at give de endelige earned points.</p>
  <p><em>Eksempel:</em> Rank 2 (18 point) × sværhedsgrad 3 → 54 point</p>
</div>



      {/* Recent Activities Section */}
      <div className="recent-activities-section card">
        <h2>De sidste 5 gennemførte spil</h2>

        {loadingActivities ? (
          <p>Loading recent activities...</p>
        ) : errorActivities ? (
          <p className="error-message">{errorActivities}</p>
        ) : recentActivities.length === 0 ? (
          <p className="no-results-message">Ingen gennemførte spil fundet.</p>
        ) : (
          <ul>
            {recentActivities.map((activity) => (
              <li key={activity.id} className="activity-card">
                <strong>Game:</strong> {activity.gameName} -{" "}
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
