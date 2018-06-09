'use strict';

var mongoose = require('mongoose');
var Match = mongoose.model('Match');

// check status of match
exports.poll = function(req, res) {
    if (req.query.matchId) {
        var matchId = req.query.matchId;

        Match.findById(matchId, (error, doc) => {
            if (error || !doc) {
              res.status(404).json({
                error: "Match doc not found: " + matchId 
              });
            } else {
                res.status(200).json(doc);
            }
        });

    } else {
        res.status(400).json({
            error: "Requires match id param: " + matchId
        });
    }
}

// submit player turn (once)
exports.turn = function(req, res) {
    if (req.query.matchId && req.query.playerId && req.query.move) {
        var {matchId, playerId, move} = req.query;

        Match.findById(matchId, (error, doc) => {
            if (error || !doc) {
              res.status(404).json({
                error: "Match doc not found: " + matchId 
              });
            } else {
                // match found - record the player's turn
                if (playerId === doc.owner_id) {
                    if (!doc.owner_move) {
                        doc.owner_move = move;
                        returnUpdatedMatchTurn(res, doc, matchId, doc.owner_id);
                    } else {
                        // player owner already moved
                        returnUnchangedMatchTurn(res, doc, matchId, doc.owner_id);
                    }
                    
                } else if (playerId === doc.opponent_id) {
                    if (!doc.opponent_move) {
                        doc.opponent_move = move;
                        returnUpdatedMatchTurn(res, doc, matchId, doc.opponent_id);
                    } else {
                        // player opponent already moved
                        returnUnchangedMatchTurn(res, doc, matchId, doc.opponent_id);
                    }
                    
                } else {
                    res.status(400).json({
                        error: "Player id not matching: " + playerId + " for match id: " + matchId
                    });
                }
            }
        });

        
    } else {
        res.status(400).json({error: "Error expected query: matchId, playerId, move"});
    }
};

// update match turn
const returnUpdatedMatchTurn = function(res, doc, matchId, playerId) {
    console.log("Updating Match turn for player id: " + playerId + " match id: " + matchId);
    // once both turns are registered then we can evalute players moves to decide the winner
    if (doc && doc.owner_move && doc.opponent_move) {
        const elements = ["earth","water","fire"];
        const winnerResult = evaluateMoves(doc.owner_move, doc.opponent_move);
        if (winnerResult === 0) {
            // draw
            doc.winner_id = "";
            doc.winner_message = "Draw";
        } else if (winnerResult === 1) {
            // owner wins
            doc.winner_id = doc.owner_id;
            doc.winner_message = elements[doc.owner_move] + " beats " + elements[doc.opponent_move]; 
        } else if (winnerResult === 2) {
            // opponent wins
            doc.winner_id = doc.opponent_id;
            doc.winner_message = elements[doc.opponent_move] + " beats " + elements[doc.owner_move];
        }
    }
    // update match doc
    doc.save((error, updatedDoc) => {
        if (!error) {
            res.status(200).json(updatedDoc);
        } else {
            // Failed to update model - is there an invalid move number?
            res.status(400).json({
                error: "Failed to update for player id: " + playerId + " match id: " + matchId
            });
        }
    });
}

// unchanged match turn
const returnUnchangedMatchTurn = function(res, doc, matchId, playerId) {
    console.warn("Double posting move is not allowed for player id: " + playerId + " match id: " + matchId);
    res.status(200).json(doc);
}

// RPS game logic for 2 players
const evaluateMoves = function(p1Move, p2Move) {
    var result = p1Move - p2Move;

    if (result === 0) {
        // draw
        return 0;
    } else if (result === -1 || result === 2) {
        // player 1 wins
        return 1;
    } else if (result === 1 || result === -2) { 
        // player 2 wins
        return 2;
    } else {
        // unknown result
        throw Error('Warning unknown result:' + result);
    }
}

// test
const createTestMatch = function(res) {
    var match = {
        owner_id: "player1",
        opponent_id: "player2",
    }
    var newMatch = new Match(match);
    newMatch.save(function(err, doc) {
        if (err) res.send(err);
        res.json(doc);
    });
}