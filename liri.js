const axios = require("axios");
const omdbApi = require('omdb-client');
const Spotify = require('node-spotify-api');
const moment = require('moment');
const fs = require('fs');
const path = require('path')
const os = require('os');
const keys = require('./keys.js')

//********logger************ */
function appendFile(command, value) {
    fs.appendFile(path.join(__dirname, 'log.txt'), `${command} : ${value} ` + os.EOL, (err) => {
        if (err) throw err;
    });
}
//********logger************ */

function readFile() {
    let fileData = fs.readFileSync(path.join(__dirname, 'random.txt'), 'utf8').split(':');
    return fileData;
}

// ********************* OMDB*********************
function searchMovies(movies = 'alien') {
    appendFile(process.argv[2], movies);
    var params = {
        apiKey: keys.omdb.id,
        title: movies.trim(),
        year: 2012
    }
    omdbApi.get(params, function (err, data) {
        console.log('\n\n');
        console.log(`* Title of the movie is ${data.Title}`);
        console.log(`* IMDB Rating of the movie is ${data.imdbRating}`);
        console.log(`* Rotten Tomatoes Rating of the movie ${data.Ratings[0].value}`);
        console.log(`* Country where the movie was produced is ${data.Country}`);
        console.log(`* Language of the movie is ${data.Language}`);
        console.log(`* Plot of the movie is ${data.Plot}`);
        console.log(`* Actors in the movie are ${data.Actors}`);
        console.log('\n\n');
    });
}

/// ************format Address from lat long******
function formatAddress(latlong) {
    const queryURL = `https://api.opencagedata.com/geocode/v1/json?q=${latlong}&key=${keys.latlongKey.id}`;
    const formattedAdress = axios({
        url: queryURL,
        method: "GET"
    }).then(address => address.data.results[0].formatted);
    return formattedAdress;
}

// ********************OMDB*********************

// ********************Bands in Town for concerts***************

function searchConcerts(concerts = 'pink') {
    const artist = concerts.trim();
    appendFile(process.argv[2], artist);

    const url = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${keys.bands.id}&limit=1`;
    // console.log(queryURL);
    axios({
        url,
        method: "GET"
    }).then(concerts => {
        formatAddress(`${concerts.data[0].venue.latitude},${concerts.data[0].venue.longitude}`).then(address => {
            console.log(`\n\n`);
            console.log('********************************************************');
            console.log(`*Venue Name: ${concerts.data[0].venue.name}\n*Venue: ${address}`);
            console.log(`*Date of the Event: ${moment(concerts.data[0].datetime).format('LLLL')}`);
            console.log('********************************************************');
            console.log(`\n\n`);
        });
    }).catch(err => {
        console.log('Search for another concert!!');
    });
}
// ********************Bands in Town for concerts***************


// ********************Spotify for songs*************** 
function songSearch(songs = 'The Sign') {
    appendFile(process.argv[2], songs);
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });
    spotify.search({
        type: 'track',
        query: songs.trim()
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('\n\n')
        console.log(`* The Name of song is : ${(data.tracks.items[0].name).toUpperCase()}`);
        console.log(`* The Artist of song is : ${(data.tracks.items[0].artists[0].name).toUpperCase()}`);
        console.log(`* The Album of song is : ${(data.tracks.items[0].album.name).toUpperCase()}`);
        console.log(`* The Preview Url of song is : ${data.tracks.items[0].preview_url}`);
        console.log('\n\n')
    });
}
// ********************Spotify for songs**************

let demand = {
    'movie-this': (movie = 'alien') => searchMovies(movie),
    'concert-this': (concert = 'pink') => searchConcerts(concert),
    'spotify-this-song': (song = 'honest') => songSearch(song),
    'do-what-it-says': () => {
        const newData = readFile();
        demand[newData[0].trim()](newData[1].trim())
    }
}

demand[process.argv[2]]((process.argv[3]) || undefined)