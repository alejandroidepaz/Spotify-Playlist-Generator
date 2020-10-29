const express = require('express');
const app = express();
const router = express.Router();
var bodyParser = require("body-parser");

// general app use statements
app.use(bodyParser.json());

// Spotify URI endpoints  
app.get('/', function(req, res){

    var responseMsg = {response:"HOMEPAGE"};
    res.json(responseMsg);
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