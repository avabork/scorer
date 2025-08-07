// server/models/Match.js
const mongoose = require('mongoose');

// A sub-document for each innings' details
const InningsSchema = new mongoose.Schema({
    battingTeam: { type: String, required: true },
    bowlingTeam: { type: String, required: true },
    score: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    oversCompleted: { type: Number, default: 0 },
    ballCountInOver: { type: Number, default: 0 },
    isFinished: { type: Boolean, default: false }
});

const MatchSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teams: { type: [String], required: true },
    overs: { type: Number, required: true },
    totalWickets: { type: Number, default: 10 },
    
    tossWinner: { type: String, required: true },
    decision: { type: String, required: true }, // 'bat' or 'field'

    status: { type: String, default: 'In Progress' }, // 'In Progress', 'Innings Break', 'Finished'
    currentInnings: { type: Number, default: 1 },
    target: { type: Number, default: 0 }, // Target to chase in the 2nd innings

    innings: {
        '1': InningsSchema,
        '2': InningsSchema
    },

    result: { type: String, default: '' } // e.g., "Team A won by 5 wickets"
}, { timestamps: true });

module.exports = mongoose.model('Match', MatchSchema);