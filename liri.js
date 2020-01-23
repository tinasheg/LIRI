require("dotenv").config();
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");

const spotify = new Spotify(keys.spotify);

let action = process.argv[2];
let value = process.argv[3];

for (let i = 4; i < process.argv.length; i++) {
  value += ' ' + process.argv[i];
}

switch (action) {
  case "concert-this":
    getBands(value)
    break;
  case "spotify-this-song":
    getSongs(value)
    break;
  case "movie-this":
    if (value == "") {
      value = defaultMovie;
    }
    getMovies(value)
    break;
  case "do-what-it-says":
    doWhatItSays()
    break;
  default:
    break;
}
function getBands(artist) {
  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {
      let eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
     
      let results = `
      concert-this
      ------------
      "Name of the venue:" ${response.data[0].venue.name}
      Venue location: ${response.data[0].venue.city}
      Date of the Event: ${eventDate}

      ============
      `
      console.log(results);
      writeLog(results);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getSongs(songName) {
  if (songName === undefined) {
    songName = "I Saw the Sign";
  }

  spotify.search({ type: 'track', query: songName }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    // //Artist(s)
    // console.log("Artists: ", data.tracks.items[0].album.artists[0].name)
    // // A preview link of the song from Spotify
    // console.log("Preview Link: ", data.tracks.items[0].preview_url)
    // // The album that the song is from
    // console.log("Album Name: ", data.tracks.items[0].album.name)

    let results = `
    spotify-this-song
    -----------------
    Artist(s): ${data.tracks.items[0].album.artists[0].name}
    Preview Link: ${data.tracks.items[0].preview_url}
    Album Name: ${data.tracks.items[0].album.name}

    =================
    `
    console.log(results);
    writeLog(results);
  });
}

function getMovies(movieName) {

  axios.get("http://www.omdbapi.com/?apikey=42518777&t=" + movieName)
    .then(function (data) {
      // console.log(data.data); 
      let results = `
      movie-this
      ----------
      Title of the movie: ${data.data.Title}
      Year the movie came out: ${data.data.Year}
      IMDB Rating of the movie: ${data.data.Rated}
      Rotten Tomatoes Rating of the movie: ${data.data.Ratings[1].Value}
      Country where the movie was produced: ${data.data.Country}
      Language of the movie: ${data.data.Language}
      Plot of the movie: ${data.data.Plot}
      Actors in the movie: ${data.data.Actors}
      ===========`;
      console.log(results);
      writeLog(results);
    })
    .catch(function (error) {
      console.log(error);
    });
 
    if (movieName === "Mr. Nobody") {
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
  };
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    data = data.split(",");
    let action = data[0]
    let value = data[1]
    // getSongs(value)
    switch (action) {
      case "concert-this":
        getBands(value)
        break;
      case "spotify-this-song":
        getSongs(value)
        break;
      case "movie-this":
        getMovies(value)
        break;
      default:
        break;
    }
  });
}

function writeLog(result) {
  fs.appendFile('log.txt', `${result}`, function (err) {
    if (err) throw err;
  })
}