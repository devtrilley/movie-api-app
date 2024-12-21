// Client Side JS file to connect to backend
// Since this is the client side/for the browser, we would use Fetch and not Axios

// Getting DOM elements
const searchForm = document.querySelector(".search-form"); // <form> container
const searchInput = document.querySelector(".search-query-input"); // Search box for query
const searchResults = document.querySelector(".search-results"); // <ul> list for search result/list of movies
const similarMovies = document.querySelector(".similar-movies"); // <ul> list for similar movies

// Sumbit form event listener
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevents page from reloading on submission
  const query = searchInput.value.trim(); // In this file, query whatever the user types in the textbox at time of submission

  // If there is no query/ if it's falsy
  if (!query) {
    alert("Please enter a movie name"); // MVP error, will dynamically display error later
    return; // break out of function after alert
  }

  // Clear previous results for search results and similar movies
  searchResults.innerHTML = ""; // Makes search results <ul> blank
  similarMovies.innerHTML = ""; // Makes similar moives <ul> blank

  try {
    // Sends GET request to /search endpoint w/ query string dynamically appended. Waiting for the response from search before continuing
    // encodeURIComponent() makes sure special characters in query are properly encoded/converted for the URL's format
    const response = await fetch(`/search?query=${encodeURIComponent(query)}`);

    const htmlContent = await response.text(); // Reads the body of a response as a string, turning JSON in JS code, HTML in our case

    document.body.innerHTML = htmlContent; // Reloads page with server-rendered code from search.hbs
  } catch (error) {
    console.error(`Error fetching search results: ${error}`); // Error message will print if try has erro
    alert("Failed to fetch search results. Please try searching again."); // Will dynamic display error later.
  }
});
