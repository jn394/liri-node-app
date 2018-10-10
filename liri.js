require("dotenv").config();

var keys = require('./keys.js');
var request = require("request");
var moment = require('moment');
var fs = require("fs");

//Command Line Entrys
var command = process.argv[2];
var entry = process.argv.slice(3).join(" ");;

switch (command) {
    case "concert-this":
        concertThis(entry);
        break;
    case "spotify-this-song":
        spotifyThis(entry);
        break;
    case "movie-this":
        movieThis(entry);
        break;
    case "do-what-it-says":
        doThis();
        break;
};

//Concert-This
function concertThis(artist) {
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var test = JSON.parse(body);
            for (var i = 0; i < test.length; i++) {
                //Name of Venue
                console.log("Venue Name: " + test[i].venue.name);
                //Venue Location
                console.log("Location: " + test[i].venue.city + ", " + test[i].venue.region + " " + test[i].venue.country);
                //Date of Venue
                var dateTime = test[i].datetime;
                console.log("Date: " + moment(dateTime).format("MM/DD/YYYY"));
                console.log('---------------------------------------------------------------');
            };
        };
    });
};

//Spotify-This-Song
function spotifyThis(song) {
    if (song === "") {
        song = "The Sign";
    };

    var Spotify = require("node-spotify-api");

    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < data.tracks.items.length; i++) {

            //artist name
            console.log("Artist(s): " + data.tracks.items[i].artists[0].name);
            //song name 
            console.log("Song's name: " + data.tracks.items[i].name);
            //preview link 
            console.log("A preview link: " + data.tracks.items[i].preview_url);
            //album name
            console.log("Album: " + data.tracks.items[i].album.name);
            console.log('---------------------------------------------------------------');
        }
    });
};

//Movie-This
function movieThis(movieName) {
    if (movieName === "") {
        movieName = "Mr. Nobody";
    };

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            //Movie Title
            console.log("Title: " + JSON.parse(body).Title);
            //Movie Year
            console.log("Release Year: " + JSON.parse(body).Year);
            //Movie IMDB Rating
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            //Movie Tomatoes Rating
            console.log("RT Rating: " + JSON.parse(body).Ratings[1].Value);
            //Movie Country
            console.log("Country: " + JSON.parse(body).Country);
            //Movie Lanuage
            console.log("Lanuage: " + JSON.parse(body).Language);
            //Movie Plot
            console.log("Plot: " + JSON.parse(body).Plot);
            //Movie Cast
            console.log("Cast: " + JSON.parse(body).Actors);
            console.log('---------------------------------------------------------------');
        }
    });
};

//Do-What-I-Say
function doThis() {
    fs.readFile("random.txt", "utf8", function (err, data) {

        if (err) {
            console.log(err);
        };
        var myArray = data.split(",");

        if (myArray[0] === "spotify-this-song") {
            spotifyThis(myArray[1]);
        };
    });
};