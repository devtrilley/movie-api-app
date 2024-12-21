// Client Side JS file to connect to backend
// Since this is the client side/for the browser, we would use Fetch and not Axios

// Getting DOM elements
const searchForm = document.querySelector(".search-form"); // <form> container
const searchInput = document.querySelector(".search-query-input"); // Search box for query
const searchResults = document.querySelector(".search-results"); // <ul> list for search result/list of movies
const similarMovies = document.querySelector(".similar-movies"); // <ul> list for similar movies
const findSimilarForm = document.querySelector(".find-similar-form"); // Form holding "Find Similar" button to trigger /similar endpoint

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

// findSimilarForm event listener to keep it from refreshign so our lists stay dynamic
findSimilarForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Keeps page from refreshing

  // Getting movieID from hidden input in "Find Similar form"
  // Create FormData object out of findSimilarForm. This objects gets all the input values from the form, including our hidden one.
  const formData = new FormData(findSimilarForm);
  // Takes the value attribute of the <input> in the form with the name "movie_id"
  const movieId = formData.get("movie_id"); 

  similarMovies.innerHTML = "<li>Loading...</li>"; // Loading message as a list item

  // Try to fetch() similar movies at our /similar endpoint, catch if there's an error
  try {
    // Fetch() similar movies at /similar
    const response = await fetch(`/similar?movie_id=${movieId}`); // API response
    // Parse API JSON response to JS. Now holds arr of movie objects. "Similar Movies Array"
    const simMoviesArr = await response.json();

    // Clears previous list/loading message
    similarMovies.innerHTML = "";

    // If simMoviesArr array from API is empty, then no similar movies can be found
    if (simMoviesArr.length === 0) {
      similarMovies.innerHTML = "<li>No similar movies found.</li>";
      return;
    }

    // Populate similar movies list by appending using forEach
    /* Appending rather than using render() on the server side. We're only updating part of the page, so render() would be overkill sending too many server responses causing delays and slows down our code */
    simMoviesArr.forEach((movie) => {
      const listItem = document.createElement("li"); // Create a new <li>
      // Changing the text of the newly created list item. Default if movie release date in unknown
      listItem.textContent = `${movie.title} - ${
        movie.releaseDate || "Date Unknown"
      }`;
      similarMovies.appendChild(listItem); // Appends each list to similarMovies <ul>
    });
  } catch (error) {
    console.error(`Error fetching similar movies: ${error}`);
    similarMovies.innerHTML = "<li>Failed to load similar movies.</li>";
  }
});
