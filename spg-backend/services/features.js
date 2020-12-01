const fetch = require('node-fetch');


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
  
  return body.audio_features;
}

function weeder(songs, features, size) {
  let result = [];

  let baseline = 0.5, acceptanceThreshold = 0.15, deviationThreshold = 0.10;
  let prefs = {
    "danceability": 0.75,
    "energy": 0.35,
    "valence": 0.8
  }

  for (let i = 0; i < songs.length; i++) {
    let song  = songs[i];
    let featureSet = features[i];

    // assume song fits criteria
    let fits = true;

    Object.keys(prefs).forEach((key) => {
      let val = prefs[key];
      // check if a preference is modified enough to evaluate
      if ((val > baseline + deviationThreshold) || (val < baseline - deviationThreshold)) {

        // check if preference fits our filter criteria
        if ((featureSet[key] > (val + acceptanceThreshold)) || (featureSet[key] < (val - acceptanceThreshold))) {
          fits = false;
        }
      }
    })

    if (fits) {
      // if song fits criteria, add it to playlist
      result.push({ name: song.name, id: song.id, uri: song.uri });
  
      // break loop and return playlist if we reach desired size
      if (result.length >= size) {
        return result;
      }
    }
  }

  return result;
}

module.exports = {
  weeder,
  getAudioFeatures,
}