'use strict';

var mongoose = require('Mongoose');
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
        type: String,
        required: 'Game Id not specified'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Match', MatchSchema);