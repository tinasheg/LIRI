require("dotenv").config();
const keys = require("./keys.js");

const spotify = new spotify(keys.spotify);