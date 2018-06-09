'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lobbySchema = new Schema({
    owner_id: {
        type: String
    },
    code: {
        type: String
    },
    public: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lobby', lobbySchema);