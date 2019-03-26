var axios = require("axios");
var omdbApi = require('omdb-client');
var Spotify = require('node-spotify-api');

//***************API's */

// [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)

//  [Axios](https://www.npmjs.com/package/axios)

// You'll use Axios to grab data from the [OMDB API](http://www.omdbapi.com) and the [Bands In Town API](http://www.artists.bandsintown.com/bandsintown-api)

// [Moment](https://www.npmjs.com/package/moment)

//  [DotEnv](https://www.npmjs.com/pacnpm i dotenvkage/dotenv)
//******************** */

function grab(data) {
    let value = process.argv.indexOf(data);
    return (value === -1) ? null : process.argv[value + 1];
}


let liriRequest = grab(process.argv[2]);
// let concertRequest = grab('concert');
// let movieRequest = grab('movie');
console.log(liriRequest);

// ********************* OMDB*********************
function searchMovies(movies) {
    var params = {
        apiKey: 'trilogy',
        title: movies,
        year: 2012
    }
    omdbApi.get(params, function (err, data) {
        console.log(data);
    });

}
// ********************OMDB*********************

// ********************Bands in Town for concerts***************

function searchConcerts(concerts) {
    let artist = concerts;
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
    axios({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // Printing the entire object to console
        console.log(response.data);
    });
}
// ********************Bands in Town for concerts***************


// ********************Spotify for songs*************** 
function songSearch(songs) {
    var spotify = new Spotify({
        id: '42c2e2c6fb9c438ab666209481661822',
        secret: '6080687f959f4a86ac8db3b0728b3fab'
    });
    spotify.search({
        type: 'track',
        query: songs
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
    });
}
// ********************Spotify for songs**************


switch (process.argv[2]) {
    case ('spotify-this-song'):
        searchMovies(process.argv[3].trim());
        break;
    case ('concert-this'):
        searchConcerts(process.argv[3].trim());
        break;
    case ('movie-this'):
        songSearch(process.argv[3].trim());
        break;

    case ('do-what-it-says'):
        songSearch(process.argv[3].trim());
        break;
}