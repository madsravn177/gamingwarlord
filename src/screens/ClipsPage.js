import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig"; // Firestore-konfiguration
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
import "../styles/ClipsPageScreen.css"; // Import CSS-filen

const ClipsPage = () => {
  const [clips, setClips] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoLink, setVideoLink] = useState(""); // Tilføj link som mulighed
  const [title, setTitle] = useState(""); // Tilføj titel til videoen

  const storage = getStorage(); // Initialiser Firebase Storage

  // Hent klip fra Firestore
  useEffect(() => {
    const fetchClips = async () => {
      const clipsCollection = collection(db, "clips");
      const clipsSnapshot = await getDocs(clipsCollection);
      const clipsList = clipsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClips(clipsList);
    };

    fetchClips();
  }, []);

  // Håndter video-upload eller link
  const handleAddClip = async () => {
    if (title.trim() === "") return; // Sørg for, at titlen er udfyldt

    try {
      let downloadURL = videoLink; // Standard: Brug linket, hvis det er udfyldt

      if (videoFile) {
        // Hvis en fil er valgt, upload den til Firebase Storage
        const storageRef = ref(storage, `clips/${videoFile.name}`);
        await uploadBytes(storageRef, videoFile);

        // Hent download-URL for videoen
        downloadURL = await getDownloadURL(storageRef);
      }

      if (!downloadURL) return; // Sørg for, at der enten er en fil eller et link

      // Gem video-URL og titel i Firestore
      const clipsCollection = collection(db, "clips");
      await addDoc(clipsCollection, { title, url: downloadURL, createdAt: new Date() });

      // Opdater klip-listen
      const clipsSnapshot = await getDocs(clipsCollection);
      const clipsList = clipsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClips(clipsList);

      // Ryd input
      setVideoFile(null);
      setVideoLink("");
      setTitle("");
    } catch (error) {
      console.error("Fejl ved upload af video eller link:", error);
    }
  };

  return (
    <div className="clips-page">
      <h1>Del dit klip</h1>
      <div>
        <input
          type="text"
          placeholder="Skriv en overskrift til videoen"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          style={{ marginTop: "10px" }}
        />
        <br />
        <input
          type="text"
          placeholder="Eller indsæt et link til videoen"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          style={{ marginTop: "10px" }}
        />
        <br />
        <button onClick={handleAddClip} style={{ marginTop: "10px" }}>
          Upload Video
        </button>
      </div>
      <div className="clips-grid">
        {clips.map((clip) => (
          <div key={clip.id} className="clip-card">
            <h3>{clip.title}</h3>
            {clip.url.includes("http") ? (
              <video controls src={clip.url} style={{ width: "100%" }}></video>
            ) : (
              <p>Videoen kunne ikke indlæses.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClipsPage;