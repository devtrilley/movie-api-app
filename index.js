// Backend Logic/Server File

// Loads in needed npm modules
const express = require("express"); // To set up our server
const dotenv = require("dotenv").config(); // Module used secure API key in .env file
const path = require("path"); // Imports path module for easier path syntax
const axios = require("axios"); // Using Axios instead of request to experiment with new modules
const hbs = require("hbs"); // Importing handlebars for express
const { log } = require("console");

// Checks if API key from .env is there
// console.log(process.env);

// Initialize the Express App
const app = express();

// Sets Handlebars as the view engine
app.set("view engine", "hbs");

// Tells express the path to the views directory to access hbs templates
app.set("views", path.join(__dirname, "views"));

// Serves static files like stylesheets and JS from our public directory. Tell express where they are
app.use(express.static(path.join(__dirname, "public")));

// Setting server PORT, 3000 for localhost
const PORT = 3000;

// This line is know as "Middleware", code that runs between the request and response
app.use(express.json()); // the .json() method parses JSON to JS code

// Sets route for /search, to search for movies
app.get("/search", async (req, res) => {
  const query = req.query.query; // Gets query param from our URL
  // console.log(req.query.query); // Log to test if queries are returning properly

  // If there is no query added to the URL. Also adds query validation for empty queries and searches too long for realistic searches
  // .trim() was used in cases where whitespace was added unneedingly.
  // Average movie title length is 20-30. 70 is plenty of enoguh characters
  if (!query || query.trim() === "" || query.length > 70) {
    return res
      .status(400)
      .render("search", { error: "You must add a query parameter!" });
  }

  try {
    // We will wait for axios to get data back from the API before continuing
    // The data sent will be saved in "response"
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie", // URL Param we send GET request to
      {
        // Config object with params that Axios will append to URL
        params: {
          api_key: process.env.MOVIEDB_API_KEY, // .env file API key property
          query: query, // The users search query
        },
      }
    );

    // Where the movie data is stored. We're using .map() so for each movieObj, we push a new object with only the information we need (id, and movie title)
    // Then we render the results, the first param is the handlebars file/view we want to render in
    // the 2nd param is a local, holds the data we want to pass to search.hbs
    res.render("search", {
      // Movies is the array map returns holding all the movie objects with the properties we want
      movies: response.data.results.map((movieObj) => ({
        id: movieObj.id, // Movie's TMDB ID
        title: movieObj.title, // Movie Title
        releaseDate: movieObj.release_date, // Movie release date to help differentiate movies
        overview: movieObj.overview, // Movie description
      })),
      query: query, // Passes user's search query to the template
    });
  } catch (error) {
    // If there's an error in try, catch block is ran
    console.log(`Error fetching searched movies: ${error.message}`);
    res.status(500).render("search", { error: "Failed to fetch movies" }); // Sets status code to 500 (internal error)
  }
});

// Sets up route for /similar, to see similar movies
app.get("/similar", async (req, res) => {
  const movieId = req.query.movie_id; // Gets selected Movie's ID from the query params
  console.log(movieId);

  // Error check If there is no movie ID or if the value passed isn't a number, which we can only accept
  if (!movieId || isNaN(movieId)) {
    return res.status(400).json({
      error: "Invalid/missing Movie ID",
    });
  }

  // Make API call with Axios
  try {
    // Interpolating movieId into API url to fetch data for right movie
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/similar`,
      {
        params: {
          api_key: process.env.MOVIEDB_API_KEY, // API key in .env
        },
      }
    );

    // Where the similar movies array of movie objects are stored. Using .map() to only return objects with the properties we want
    res.render("search", {
      // Map() returned array stored in similarMovies property
      similarMovies: response.data.results.map((movieObj) => ({
        id: movieObj.id, // Movie's TMDB ID
        title: movieObj.title, // Movie Title
        releaseDate: movieObj.release_date, // Movie release date to help differentiate movies
      })),
    });
  } catch (error) {
    console.error(`Error fetching similar movies: ${error.message}`); // Similar to console.log(), but prints specifically an error message to the console
    res
      .status(500)
      .render("search", { error: "Failed to fetch similar movies" });
  }
});

// Starts the app to listen
app.listen(PORT, () => {
  console.log(`Server is live! At http://localhost:${PORT}`);
});
