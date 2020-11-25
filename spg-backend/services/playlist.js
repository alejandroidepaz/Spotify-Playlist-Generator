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

module.exports = {
  savePlaylist,
}