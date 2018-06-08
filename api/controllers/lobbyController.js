'use strict';

var mongoose = require('mongoose');
var Lobby = mongoose.model('Lobby');

exports.poll = function(req, res) {
    var playerCount = 0;
    
    var playerCount = Lobby.find({});

    console.log(playerCount);
    res.json(playerCount);
};

exports.connect = function(req, res) {
    if (typeof req.body !== 'undefined' && req.body.lobbyId) {
        // LOBBY ID PROVIDED
        Lobby.findOne({ code: req.body.lobbyId, public: false }, function(err, lobby) {
            if (err) res.send(err);
    
            // Check Lobby Id exists
            if (!!lobby) {
                console.log('Found Lobby: ' + req.body.lobbyId);

                // TODO: Delete Lobby entry
                // TODO: Create Match entry
            }
            else {
                console.log('No Lobby found with ID: ' + req.body.lobbyId);

                res.send(err);
            }
        });
    }
    else {
        // MATCHMAKING NEEDED
        console.log('No Lobby Id -- matchmaking');
        Lobby.findOne({ public: true }, function(err, lobby) {
            if (!!lobby) {
                console.log('Matched with a user!');
                
                // TODO: Delete Lobby entry
                // TODO: Create Match entry

                res.json(lobby);
            }
            else {
                // Create new Lobby
                var newLobby = new Lobby(req.body);

                newLobby.save(function(err, lobby) {
                    if (err) res.send(err);

                    res.json(lobby);
                });
            }
        });
    }
};

exports.create = function(req, res) {
    var newlobby = new Lobby(req.body);

    newlobby.save(function(err, lobby) {
        if (err) res.send(err);

        res.json(lobby);
    });
};