const express = require('express');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json()); 
app.use(express.static('public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

spotifyApi.clientCredentialsGrant().then(
  (data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Access token successfully retrieved.');
  },
  (err) => {
    console.log('Error retrieving access token', err);
  }
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/search', async (req, res) => {
  const query = req.body.query;
  const sortBy = req.body.sortBy || 'popularity';

  try {
    const data = await spotifyApi.searchTracks(query);
    let tracks = data.body.tracks.items.map((track) => ({
      name: track.name,
      artists: track.artists.map((artist) => artist.name).join(', '),
      album: track.album.name,
      link: track.external_urls.spotify,
      imageUrl: track.album.images[0]?.url,
      releaseDate: track.album.release_date,
      duration: track.duration_ms / 1000, 
      previewUrl: track.preview_url
    }));

    if (sortBy === 'releaseDate') {
      tracks = tracks.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sortBy === 'popularity') {
      tracks = tracks.sort((a, b) => b.popularity - a.popularity);
    }

    res.json({ tracks: tracks });
  } catch (err) {
    console.log('Error fetching data from Spotify:', err);
    res.status(500).json({ error: 'Error fetching data from Spotify' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
