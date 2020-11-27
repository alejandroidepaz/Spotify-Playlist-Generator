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
    let authRes = await fetch(url, options);

    // set error if token fetch fails
    if (authRes.status == 400) {
      result.error = authRes.statusText;
    }
    // if fetch doesn't fail, send tokens back
    else {
      let authBody = await authRes.json();
      result.access_token = authBody.access_token;
      result.refresh_token = authBody.refresh_token;
    }

    return result;
}

// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {

//     var access_token = body.access_token,
//         refresh_token = body.refresh_token;

//     var options = {
//       url: 'https://api.spotify.com/v1/me',
//       headers: { 'Authorization': 'Bearer ' + access_token },
//       json: true
//     };

    // fetch user's info including name, profile picture, etc.
    // request.get(options, function(error, response, body) {
    //   if (!error && response.statusCode === 200) {
    //     // redirect user back to frontend profile page
    //     res.redirect('http://localhost:3000/profile?' +
    //     querystring.stringify({
    //       access_token: access_token,
    //       refresh_token: refresh_token,
    //       name: body.display_name,
    //       image: body.images.length > 0 ? body.images[0].url : null,
    //       profileLink: "spotify" in body.external_urls ? body.external_urls.spotify : null
    //     }));
    //   } else {
    //     res.redirect('http://localhost:3000/?' +
    //       querystring.stringify({
    //         error: 'state_mismatch'
    //       }));
    //   }
    // });
//   } else {
//     res.redirect('http://localhost:3000/?' +
//       querystring.stringify({
//         error: 'state_mismatch'
//       }));
//   }
// });

//   let url = 'https://accounts.spotify.com/api/token';
//   let options = {
//     method: 'POST',
//     form: JSON.stringify({
//       code: code,
//       redirect_uri: redirect_uri,
//       grant_type: 'authorization_code'
//     }),
//     headers: {
//       'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//     },
//     json: true
//   };

//   let res = await fetch(url, options);
//   // let body = await res.json();

//   console.info(res);

//   // if (body.error) {
//   //   result.error = body.error;
//   // }
//   // else {
//   //   result.access_token = body.access_token;
//   //   result.refresh_token = body.refresh_token;
//   // }

//   return result;
// }

// async function getUserInfo(access_token, refresh_token) {
//   let result = {
//     error: null,
//     name: null,
//     id: null,
//     image: null,
//     profileLink: null
//   };

//   let url = 'https://api.spotify.com/v1/me';
//   var options = {
//     headers: { 'Authorization': 'Bearer ' + access_token },
//     json: true
//   };

//   let res = await fetch(url, options);
//   let body = await res.json();

//   if (body.error) {
//     result.error = body.error;
//   }
//   else {
//     result.name = body.display_name,
//     result.id = body.id;
//     result.image = body.images.length > 0 ? body.images[0].url : null;
//     result.profileLink = "spotify" in body.external_urls ? body.external_urls.spotify : null;
//   }

//   return result;
// }

module.exports = {
  getAccessToken,
}