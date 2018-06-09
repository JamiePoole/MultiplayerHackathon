'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema = new Schema({
    owner_id: {
        type: String,
        required: 'Owner Id not specified'
    },
    opponent_id: {
        type: String,
        required: 'Opponent Id not specified'
    },
    game_id: {
        type: Number,
        default: 1
    },
    owner_move: { type: Number, min: 0, max: 2 },
    opponent_move: { type: Number, min: 0, max: 2 },
    winner_id: { type: String },
    winner_message: { type: String },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Match', MatchSchema);