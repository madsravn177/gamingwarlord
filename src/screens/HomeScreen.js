import React from "react";

function HomeScreen() {
  const username = localStorage.getItem("username");

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Select a page from the navigation bar above.</p>
    </div>
  );
}

export default HomeScreen;