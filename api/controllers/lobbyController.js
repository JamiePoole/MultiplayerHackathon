'use strict';

var mongoose = require('mongoose');
var Lobby = mongoose.model('Lobby');
var Match = mongoose.model('Match');

exports.poll = function(req, res) {
    var playerCount = 0;

    Lobby.count({}, function(err, count) {
        if (err) res.send(err);

        res.json({ count });
    });
};

exports.connect = function(req, res) {
    if (typeof req.body !== 'undefined' && req.body.player_id) {
        if (req.body.lobbyId) {
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
            Lobby.findOneAndRemove({ public: true }, function(err, lobby) {
                if (!!lobby) {
                    console.log('Matched with a user!');

                    var newMatch = new Match({ owner_id: lobby.owner_id, opponent_id: req.body.player_id});
                    
                    newMatch.save(function(err, match){
                        if (err) res.send(err);

                        res.json({ status: 'MATCHED', match_id: match.id, opponent_id: match.owner_id });
                    });
                }
                else {
                    // Create new Lobby
                    var newLobby = new Lobby(req.body);

                    newLobby.save(function(err, lobby) {
                        if (err) res.send(err);

                        res.json({ status: 'CREATED' });
                    });
                }
            });
        }
    }
    else {
        res.status(500).json({
            message: 'Invalid body data'
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