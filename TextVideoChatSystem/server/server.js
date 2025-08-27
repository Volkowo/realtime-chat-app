var express = require('express'); //used for routing
var app = express();

var path = require('path');
var cors = require('cors');
app.use(cors());
var http = require('http').Server(app); //used to provide http functionality
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(bodyParser.json());

const loginRoute = require('./routes/loginRoute');
loginRoute.route(app, '/api/auth'); // Pass the app instance and path

app.use(express.static(__dirname + '../dist/week4/browser'));


let server = http.listen(3000, function() {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Server is running (i think).");
    console.log(`Server listening on: ${host} || port: ${port}`);
})

