const express = require('express');
const cors = require('cors');
var bodyParser = require("body-parser");
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

const { client_id } = require('./credentials');
const { generateRandomString } = require('./utils');
const { stateKey, redirect_uri } = require('./constants');

const { getAccessToken, getUser } = require('./services/login');
const { fetchAllSavedSongs } = require('./services/songs');

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
app.get('/callback', async (req, res) => {

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
    // clear cookies and fetch tokens for user
    res.clearCookie(stateKey);
    const { error, access_token, refresh_token } = await getAccessToken(code);

    if (error) {
      res.redirect('http://localhost:3000/?' +
        querystring.stringify({
          error: 'access_token_reject'
        }));
    }
    else {
      // fetch user's basic profile information
      const { error, name, image, profileLink } = await getUser(access_token, refresh_token);

      if (error) {
        res.redirect('http://localhost:3000/?' +
        querystring.stringify({
          error: 'user_fetch_failure'
        }));
      }
      else {
        res.redirect('http://localhost:3000/profile?' +
        querystring.stringify({access_token, refresh_token, name, image, profileLink}));
      }
    }
  }
});

// Refresh Spotify authentication token
// TODO: figure out when to call this endpoint
// app.get('/refresh_token', (req, res) => {

//   // requesting access token from refresh token
//   var refresh_token = req.query.refresh_token;
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//     form: {
//       grant_type: 'refresh_token',
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//     else {
//       // TODO: figure out how to handle this error
//     }
//   });
// });

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