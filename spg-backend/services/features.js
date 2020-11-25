const fetch = require('node-fetch');

// assign each song to a respective category based on audio feature metrics
function assignToCategories(audioFeatures, songs) {

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

module.exports = {
  getAudioFeatures,
}