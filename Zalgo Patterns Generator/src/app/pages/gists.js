import React, { useEffect } from "react";

const URL = "https://api.github.com/gists/public";

const getGists = async () => {
  try {
    const response = await fetch(URL, {
      method: "GET",
    });
	console.clear();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Gists data:", data);
  } catch (error) {
    console.error("Error fetching gists:", error);
    // Handle the error, e.g., show an error message to the user
  }
};

export function GistPage() {
  useEffect(() => {
    getGists();
  }, []);

  return <div>d</div>;
}
