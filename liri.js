var axios = require("axios");
var omdbApi = require('omdb-client');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs');
var path = require('path')
var os = require('os');
var _ = require('lodash');

//***************API's */

// [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)

//  [Axios](https://www.npmjs.com/package/axios)

// You'll use Axios to grab data from the [OMDB API](http://www.omdbapi.com) and the [Bands In Town API](http://www.artists.bandsintown.com/bandsintown-api)

// [Moment](https://www.npmjs.com/package/moment)

//  [DotEnv](https://www.npmjs.com/pacnpm i dotenvkage/dotenv)
//******************** */

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
        apiKey: 'trilogy',
        title: movies.trim(),
        year: 2012
    }
    omdbApi.get(params, function (err, data) {
        console.log(`* Title of the movie is ${data.Title}`);
        console.log(`* IMDB Rating of the movie is ${data.imdbRating}`);
        console.log(`* Rotten Tomatoes Rating of the movie ${data.Ratings[0].value}`);
        console.log(`* Country where the movie was produced is ${data.Country}`);
        console.log(`* Language of the movie is ${data.Language}`);
        console.log(`* Plot of the movie is ${data.Plot}`);
        console.log(`* Actors in the movie are ${data.Actors}`);
    });
}

/// ************format Address from lat long******
function formatAddress(latlong) {
    var queryURL = `https://api.opencagedata.com/geocode/v1/json?q=${latlong}&key=2bb14724541d469fbc31188506fb3e6f`;
    const formattedAdress = axios({
        url: queryURL,
        method: "GET"
    }).then(address => address.data.results[0].formatted);
    return formattedAdress;
}

// ********************OMDB*********************

// ********************Bands in Town for concerts***************

function searchConcerts(concerts = 'pink') {
    let artist = concerts.trim();
    appendFile(process.argv[2], artist);
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&limit=1";
    axios({
        url: queryURL,
        method: "GET"
    }).then(concerts => {
        //   console.log(latLongValue)
        //    concerts.data.map(  concert => {
        //   console.log(`Latlong====>${concert.venue.latitude},${concert.venue.longitude}`)
        // const promise = 
        formatAddress(`${concerts.data[0].venue.latitude},${concerts.data[0].venue.longitude}`).then(address => {
            console.log(`\n
    ********************************************************\n
 *Venue Name: ${concerts.data[0].venue.name}\n\n*Venue:${address}\n
 *Date of the Event: ${moment(concerts.data[0].datetime).format('LLLL')}\n
    ********************************************************`)
            // return promise;
            // })
            // });
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
        id: '42c2e2c6fb9c438ab666209481661822',
        secret: '6080687f959f4a86ac8db3b0728b3fab'
    });
    spotify.search({
        type: 'track',
        query: songs.trim()
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`\n\n\n * The Name of song is : ${(data.tracks.items[0].name).toUpperCase()}`);
        console.log(`* The Artist of song is : ${(data.tracks.items[0].artists[0].name).toUpperCase()}`);
        console.log(`* The Album of song is : ${(data.tracks.items[0].album.name).toUpperCase()}`);
        console.log(`* The Preview Url of song is : ${data.tracks.items[0].preview_url}`);
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

demand[process.argv[2]]((process.argv[3]) || (''))