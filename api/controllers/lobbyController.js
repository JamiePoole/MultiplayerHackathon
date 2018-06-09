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
    // Player ID required
    if (typeof req.body !== 'undefined' && req.body.player_id) {
        if (req.body.code && !req.body.public) {
            // JOIN LOCAL GAME - Has provided a room code and isn't public
            Lobby.findOneAndRemove({ code: req.body.code, public: false }, function(err, lobby) {
                if (err) res.send(err);
        
                // Found that room code, create a Match (lobby was deleted)
                if (!!lobby) {
                    console.log('Found Code: ' + req.body.code);

                    var newMatch = new Match({ owner_id: lobby.owner_id, opponent_id: req.body.player_id});
                    
                    newMatch.save(function(err, match){
                        if (err) res.send(err);

                        res.json({ status: 'MATCHED', match_id: match.id, opponent_id: match.owner_id });
                    });
                }
                else {
                    // Did not find room code
                    console.log('No Lobby found with Code: ' + req.body.code);

                    res.status(400).send({ message: 'Invalid Room Code' });
                }
            });
        }
        else if (!req.body.public && typeof req.body.code == 'undefined') {
            // HOST LOCAL GAME -- not a public game and no code provided
            var roomCode = '';
            for (var i = 0; i < 3; i++) {
                roomCode += (Math.round(Math.random() * 2) + 1);
            }

            // TODO: Check room code doesn't already exist in the Lobby

            req.body.code = roomCode;
            var newLobby = new Lobby(req.body);

            newLobby.save(function(err, lobby) {
                if (err) res.send(err);

                res.json({ status: 'CREATED', code: lobby.code });
            });
        }
        else {
            // REMOTE GAME -- No code provided and game isn't public
            console.log('No Lobby Id -- matchmaking');
            Lobby.findOneAndRemove({ public: true }, function(err, lobby) {
                if (err) res.send(err);

                if (!!lobby) {
                    // JOIN REMOTE GAME -- a host/opponent was available
                    console.log('Matched with a user!');

                    var newMatch = new Match({ owner_id: lobby.owner_id, opponent_id: req.body.player_id});
                    
                    newMatch.save(function(err, match){
                        if (err) res.send(err);

                        res.json({ status: 'MATCHED', match_id: match.id, opponent_id: match.owner_id });
                    });
                }
                else {
                    // HOST REMOTE GAME -- no other opponents available
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