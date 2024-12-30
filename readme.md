# Spotify Song Finder

This is a simple web application built using Node.js, Express.js, and the Spotify Web API. The app allows users to search for songs or artists and displays relevant information about the tracks, such as song name, artist, album name, and a link to listen on Spotify. It fetches data dynamically from the Spotify API and displays it in a user-friendly format.

## Project Structure

The project follows a clean and organized folder structure:

```
Spotify-Song-Finder/
├── public/
│   └── style.css        # Stylesheet for the application
├── views/
│   └── index.html       # HTML file for the homepage
├── server.js            # Main entry point for the server
├── .env                 # Stores sensitive credentials (client ID & client secret)
├── README.md            # Documentation for the project
```

## Functionalities

1. **Homepage:**
   - A form where users can enter a song or artist name.
   - Form submission is routed to the `/search` endpoint to fetch track results.
   
2. **Spotify API Integration:**
   - Uses the `spotify-web-api-node` library to interact with Spotify's Track Search endpoint.
   - Fetches song data based on the user’s input and dynamically displays the results.

3. **Result Page:**
   - Displays the following details for each track:
     - Song Name
     - Artist(s)
     - Album Name
     - Link to listen to the song on Spotify
     - Album art (if available)
     - Release Date (if available)
   
4. **Additional Features:**
   - **Responsive design** that adjusts for different screen sizes.
   - **Sorting feature** that allows users to sort tracks by popularity, release date, or other criteria.

## How to Run the Application

1. **Prerequisites:**
   - Install [Node.js](https://nodejs.org/) (latest LTS version recommended).
   - Create a Spotify Developer account and register an app to get your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` credentials.

2. **Setup:**
   - Clone or download the project.
   - Navigate to the project folder in your terminal.
   - Install the required dependencies:
     ```bash
     npm install express body-parser spotify-web-api-node dotenv
     ```

3. **Environment Configuration:**
   - Create a `.env` file in the root of the project and add the following:
     ```
     SPOTIFY_CLIENT_ID=your_client_id
     SPOTIFY_CLIENT_SECRET=your_client_secret
     ```
   - Replace `your_client_id` and `your_client_secret` with your actual Spotify credentials.

4. **Run the Server:**
   - Start the server using the following command:
     ```bash
     node server.js
     ```
   - The server will run on `http://localhost:3000`.

5. **Access the Application:**
   - Open a web browser and go to `http://localhost:3000` to access the homepage.
