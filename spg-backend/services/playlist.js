const fetch = require('node-fetch');

// const { fetchSavedSongs } = require('../services/songs');
const { weeder } = require('../services/features');
// const { weeder, getAudioFeatures } = require('../services/features');

async function savePlaylist(access_token, refresh_token, user_id) {
  let url = `https://api.spotify.com/v1/users/${user_id}/playlists`;

  let options = {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + access_token },
    body: JSON.stringify({
      name: "Test Playlist!",
      public: false,
      collaborative: false,
      description: 'Test playlist created via Spotify Moods!'
    }),
    json: true
  };

  let res = await fetch(url, options);
  let body = await res.json();

  return { error: body.error, playlist: body.error ? null : body }
}

async function addTracks(access_token, refresh_token, playlist_id, tracks) {
  let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
  
  let options = {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + access_token },
    body: JSON.stringify({
      uris: tracks
    }),
    json: true
  };

  let res = await fetch(url, options);
  if (res.status == 201) {
    let body = await res.json();
    console.info(body);
    return { error: null }
  }
  else {
    return { error: body.statusCode }
  }
}

function generatePlaylist(access_token, refresh_token, prefetchSongs, prefetchFeatures, size, next) {
  // try to generate playlist from prefetched songs
  let playlist = weeder(prefetchSongs, prefetchFeatures, size);

  // if playlist isn't long enough after checking prefetched songs, fetch songs and try to add
  // them to the playlist until it's long enough, or we run out of saved songs
  // while (playlist.length < size && next != null) {
  //   // fetch songs with audio features
  //   let res = await fetchSavedSongs(access_token, refresh_token, next);
  //   let features = await getAudioFeatures(access_token, refresh_token, res.songs);

  //   // add songs to playlist if they fit criteria
  //   playlist = playlist + weeder(res.songs, features, size);

  //   // increment number of pages and set the url to the next page
  //   page++;
  //   next = res.next;
  // }

  return playlist;
}

module.exports = {
  savePlaylist,
  generatePlaylist,
  addTracks,
}