const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { redirect_uri } = require('../constants');
const { client_id, client_secret } = require('../credentials');

async function getAccessToken(code) {
  let result = { error: null, access_token: null, refresh_token: null };

  let url = 'https://accounts.spotify.com/api/token';
    let options = {
      method: 'POST',
      body: new URLSearchParams({
        'code': code,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
      }),
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
    };

    // request authorization tokens using user's auth code
    let res = await fetch(url, options);

    // return tokens if request is successful
    if (res.status == 200) {
      let body = await res.json();
      result.access_token = body.access_token;
      result.refresh_token = body.refresh_token;
    }
    // if request fails, return error
    else {
      result.error = authRes.statusText;
    }

    return result;
}

async function getUser(access_token, refresh_token) {
  let result = { error: null, name: null, image: null, profileLink: null };

  let url = 'https://api.spotify.com/v1/me';
  let options = {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${access_token}` },
  };

  // fetch data about user with their access token
  let res = await fetch(url, options);

  // return user data if request is sucessful
  if (res.status == 200) {
    let body = await res.json();
    result.name = body.display_name;
    result.image = body.images.length > 0 ? body.images[0].url : null;
    result.profileLink = "spotify" in body.external_urls ? body.external_urls.spotify : null;
  }
  // if not return error
  else {
    result.error = res.statusText;
  }

  return result;
}

module.exports = {
  getAccessToken,
  getUser,
}