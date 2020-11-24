const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
var request = require('request');
var bodyParser = require("body-parser");
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

const { generateRandomString } = require('./utils');
const { stateKey, redirect_uri } = require('./constants');
const { client_id, client_secret } = require('./credentials');

const app = express();

// general app use statements
app.use(bodyParser.json())
   .use(cors())
   .use(cookieParser());

// Root endpoint for testing
app.get('/', (req, res) => {

    var responseMsg = {response:"HOMEPAGE"};
    res.json(responseMsg);
});

// Spotify Authorization
app.get('/login', function(req, res) {

  // check if cookie with auth exists
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // declare scopes that allow us to read and write to user's saved songs
  var scope = 'user-library-read user-library-modify';

  // redirect to Spotify authentication page
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


// Callback for after Spotify Authorization
app.get('/callback', function(req, res) {

  // request refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('http://localhost:3000/?' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    // request authorization tokens using user's auth code
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // fetch user's info including name, profile picture, etc.
        request.get(options, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            // redirect user back to frontend profile page
            res.redirect('http://localhost:3000/profile?' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
              name: body.display_name,
              image: body.images.length > 0 ? body.images[0].url : null,
              profileLink: "spotify" in body.external_urls ? body.external_urls.spotify : null
            }));
          } else {
            res.redirect('http://localhost:3000/?' +
              querystring.stringify({
                error: 'state_mismatch'
              }));
          }
        });
      } else {
        res.redirect('http://localhost:3000/?' +
          querystring.stringify({
            error: 'state_mismatch'
          }));
      }
    });
  }
});

// Refresh Spotify authentication token
// TODO: figure out when to call this endpoint
app.get('/refresh_token', (req, res) => {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
    else {
      // TODO: figure out how to handle this error
    }
  });
});

// Fetch the user's saved songs from Spotify
app.post('/user_library', async (req, res) => {
  let access_token = req.body.access_token;
  let refresh_token = req.body.refresh_token;

  let response = await fetchAllSavedSongs(access_token, refresh_token);
  
  if (response.error) {
    res.status(500).send({ error });
  }
  else {
    res.status(200).json({ error: null, playlists: response.playlists });
  }
});

// Fetch a page of the user's saved songs from Spotify
async function fetchSavedSongs(access_token, refresh_token, url) {
  let songs = [];
  
  var options = {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token }
  };

  // fetch result from url provided
  let res = await fetch(url, options);
  let body = await res.json();

  // format response into simple list of song names and id's
  body.items && body.items.forEach((song) => {
    let track = song.track;
    songs.push({ id: track.id, name: track.name });
  });

  // return list of songs and url to next page of results (if exists)
  return { songs, next: body.next };
}

// Fetch all of a user's saved songs up to 1000
async function fetchAllSavedSongs(access_token, refresh_token) {
  var songs = [];
  var page = 0;
  var maxPage = 1;
  
  // specify url for first page of results
  let next = 'https://api.spotify.com/v1/me/tracks?limit=50';

  // start timer
  var hrstart = process.hrtime()

  // fetch pages of results until we have fetched all results or exceed max pages
  while (next != null && page < maxPage) {
      res = await fetchSavedSongs(access_token, refresh_token, next);

      // get audio features for songs fetched
      //let songsWithFeatures = await getAudioFeatures(access_token, refresh_token, res.songs);
      let categorizedSongs = await getAudioFeatures(access_token, refresh_token, res.songs);

      // add songs to result set
      //songs = songs.concat(songsWithFeatures);
      songs.push(categorizedSongs)
      // increment number of pages and set the url to the next page
      page++;
      next = res.next;
  }

  // stop timer
  var hrend = process.hrtime(hrstart);

  // log # of songs and elapsed time for testing
  console.info(`Songs fetched: ${songs.length}`);
  console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
  
  // merge all sub playlists
  var finalPlaylists = {}
  songs.forEach((playlist)=>{
    Object.keys(playlist).forEach((key) => {
      key in finalPlaylists ? finalPlaylists[key].concat(playlist[key]) : finalPlaylists[key] = playlist[key]
    })
  })
  //console.info("FINAL PLAYLIST: ", finalPlaylists)
  // return list of songs with audio features
  return {playlists: finalPlaylists};

}

// assign each song to a respective category based on audio feature metrics
function assignToCategories(audioFeatures, songs){

  let i = 0;
  let categories = ['danceability', 'energy', 'mode', 'acousticness', 'instrumentalness', 'valence', 'liveness'];
  let categorizedSongs = {}

  audioFeatures.forEach((features) => {
    
    // determine category with max value, and add this song to that respective category
    let currSong = songs[i] 
    let maxCategoryVal = -1
    let maxCategory = null 
    categories.forEach((c) => {
      if (features[c] > maxCategoryVal) maxCategory = c; 
    });

    currSong["tempo"] = features["tempo"]

    // Only create playlists necessary for songs that are in this batch
    if (maxCategory in categorizedSongs){
      categorizedSongs[maxCategory].push(currSong)
    } else{
      categorizedSongs[maxCategory] = [currSong]
    }
    i++;
  });

  return categorizedSongs

}

// Fetch audio features of songs from Spotify by id
async function getAudioFeatures(access_token, refresh_token, songs) {
  // assemble list of id's from list of songs passed
  let ids = "";
  songs.forEach((song) => {
    ids = ids + (ids.length > 0 ? "," : "") + song.id;
  });

  // inject list of id's into url
  let url = `https://api.spotify.com/v1/audio-features/?ids=${ids}`
  let options = {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token }
  };

  // fetch result from Spotify
  let res = await fetch(url, options);
  let body = await res.json();
  
  var categorizedSongs = null;
  
  if (body.audio_features) categorizedSongs = assignToCategories(body.audio_features, songs)

  // return playlists comprised on categorized songs
  return categorizedSongs;
}

// Error handling 
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Start server
const listenIP = '127.0.0.1';
const listenPort = process.env.PORT || 8000;
app.listen(listenPort, listenIP, () => {
    console.log('App listening on ' + listenIP + ':' + listenPort);
});