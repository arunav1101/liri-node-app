
require('dotenv').config()

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.bands = {
    id: process.env.BANDSINTOWN_ID
};

exports.omdb = {
    id: process.env.OMDB_ID
};

exports.latlongKey = {
    id: process.env.LATLONG_ID
};