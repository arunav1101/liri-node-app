# liri-node-app
LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.


Install Packages

npm -i

create a .env file and add the keys for

# Spotify API keys
SPOTIFY_ID=
SPOTIFY_SECRET=
# Bands in Town API keys
BANDSINTOWN_ID=
# OMDB in Town API keys
 OMDB_ID= 
# LATLONG_ID  for opencagedata.com
 LATLONG_ID=

#Get concerts
Retrieves up to your latest 20 tweets:

node liri.js concert-this Pink

#Get Song Info
Retrieves song information for a track:

node liri.js spotify-this-song "American Girl"

#Get Movie Info
Retrieves movie information for a movie:

node liri.js movie-this "Star Wars"

#Get Random Info
Gets random text inside a file and does what it says:

node liri.js do-what-it-says