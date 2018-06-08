// Imports
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var Lobby = require('./api/models/lobbyModel');
var Match = require('./api/models/matchModel');

var Routes = require('./api/routes/lobbyRoutes');

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Hackathon');

// Server Initialisation
var app = express();
var port = process.env.PORT || 5500;

// References
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
Routes(app);

// Listen
app.listen(port);

// Output
console.log('API server started on port: ' + port);