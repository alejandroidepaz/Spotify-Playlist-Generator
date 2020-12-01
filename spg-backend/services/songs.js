const fetch = require('node-fetch');
const { getAudioFeatures } = require('./features');
const { generatePlaylist } = require('./playlist');

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
    songs.push({ id: track.id, name: track.name, uri: track.uri });
  });

  // return list of songs and url to next page of results (if exists)
  return { songs, next: body.next };
}

// TODO: rename this prefetch
// Fetch all of a user's saved songs up to 1000
async function fetchAllSavedSongs(access_token, refresh_token) {
  var songs = [];
  var features = [];
  var page = 0;
  var maxPage = 10;
  
  // specify url for first page of results
  let next = 'https://api.spotify.com/v1/me/tracks?limit=50';

  // start timer
  // var hrstart = process.hrtime()

  // fetch pages of results until we have fetched all results or exceed max pages
  while (next != null && page < maxPage) {
      // fetch songs
      let res = await fetchSavedSongs(access_token, refresh_token, next);
      songs = songs.concat(res.songs);

      // fetch audio features for songs fetched
      let audioFeatures = await getAudioFeatures(access_token, refresh_token, res.songs);
      features = features.concat(audioFeatures);
      
      // increment number of pages and set the url to the next page
      page++;
      next = res.next;
  }

  // TODO: remove this from prefetch function
  let playlist = await generatePlaylist(access_token, refresh_token, songs, features, 30, null);

  // stop timer
  // var hrend = process.hrtime(hrstart);

  // log # of songs and elapsed time for testing
  // console.info(`Songs fetched: ${songs.length}`);
  // console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
  
 
  return {playlists: { "liveness": playlist}}
}

module.exports = {
  fetchSavedSongs,
  fetchAllSavedSongs,
}