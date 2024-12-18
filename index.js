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

// Starts the app to listen
app.listen(PORT, () => {
  console.log(`Server is live! At http://localhost:${PORT}`);
});
