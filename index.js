require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require("https");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//Defining my own middleware

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


var short_urls = [];

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  try {
    https.get(url, (response) => {
      short_urls = short_urls.concat(url);
      return res.json({original_url: url, short_url: short_urls.length});
    })
  } catch (e) {
    return res.json({error: "Invalid URL"});
  }
});

app.get("/api/shorturl/:index", (req, res) => {
  res.redirect(short_urls[Number(req.params.index) - 1]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
