const express = require('express');
var cors = require('cors');
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

// Spotify URI endpoints  
app.get('/', (req, res) => {

    var responseMsg = {response:"HOMEPAGE"};
    res.json(responseMsg);
});

// Spotify Authorization
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-library-read user-library-modify';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


// Callback for Spotify Authorization
app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
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

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          if (!error){
                    // we can also pass the token to the browser to make requests from there
            res.redirect('http://localhost:3000/profile?' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
              name: body.display_name,
              image: body.images.length > 0 ? body.images[0].url : null,
              profileLink: "spotify" in body.external_urls ? body.external_urls.spotify : null
            }));
          } else{

            res.sendStatus(500);
          }
        });

      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// Refresh Spotify authentication token
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
  });
});

// Fetch the user's saved songs from Spotify
app.get('/user_library', (req, res) => {
  // let offset = req.query.offset;
  let access_token = req.query.access_token;
  let refresh_token = req.query.refresh_token;

  let limit = 50;
  let offset = 0;
  // let prevSongs = null;
  var options = {
    url: `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  

  // use the access token to access the user's saved songs from the Spotify API
  request.get(options, (error, response, body) => {
    if (error) {
      res.status(500).send({ error });
    }
    else {
      console.info(body.total);
      console.info(body.next);
      let songs = [];

      body.items && body.items.forEach((song) => {
        let track = song.track;
        songs.push({ id: track.id, name: track.name });
      })
      
      res.status(200).send({ songs });
    }
  });
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