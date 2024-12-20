// Loads in needed npm modules
const express = require("express"); // To set up our server
const dotenv = require("dotenv").config(); // Module used secure API key in .env file
const axios = require("axios"); // Using Axios instead of request to experiment with new modules

// Checks if API key from .env is there
console.log(process.env);

// Initialize the Express App
const app = express();

// Setting server PORT, 3000 for localhost
const PORT = 3000;

// This line is know as "Middleware", code that runs between the request and response
app.use(express.json()); // the .json() method parses JSON to JS code

// Sets route to search for movies
app.get("/search", async (req, res) => {
  const query = req.query.query; // Gets query param from our URL

  // If there is no query added to the URL. Also adds query validation for empty queries and searches too long for realistic searches
  // .trim() was used in cases where whitespace was added unneedingly
  if (!query || query.trim() === '' || query.length > 100) {
    return res.status(400).json({ error: "You must add a query parameter!" });
  }

  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: process.env.MOVIEDB_API_KEY, // .env file API key property
          query: query, // The users search query
        },
      }
    );

    res.json(response.data.results);
  } catch (error) {
    console.log(`Error fetching movies: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Starts the app to listen
app.listen(PORT, () => {
  console.log(`Server is live! At http://localhost:${PORT}`);
});
