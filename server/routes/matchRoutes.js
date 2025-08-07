// server/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const auth = require('../middleware/authMiddleware');

// @route   POST api/matches
// @desc    Create a new match (with new two-innings structure)
router.post('/', auth, async (req, res) => {
    const { teams, overs, totalWickets, tossWinner, decision } = req.body;
    try {
        // Determine who bats and who bowls first
        let battingTeam, bowlingTeam;
        const otherTeam = teams.find(t => t !== tossWinner);

        if (decision === 'bat') {
            battingTeam = tossWinner;
            bowlingTeam = otherTeam;
        } else {
            battingTeam = otherTeam;
            bowlingTeam = tossWinner;
        }

        const newMatch = new Match({
            user: req.user.id,
            teams,
            overs,
            totalWickets,
            tossWinner,
            decision,
            innings: {
                '1': { battingTeam, bowlingTeam },
                '2': { battingTeam: bowlingTeam, bowlingTeam: battingTeam }
            }
        });

        const match = await newMatch.save();
        res.json(match);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/matches
// @desc    Get all matches for a user
router.get('/', auth, async (req, res) => {
    try {
        const matches = await Match.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/matches/:id
// @desc    Get a specific match
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ msg: 'Match not found' });
        }
        // Ensure the user requesting the match is the one who created it
        if (match.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        res.json(match);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/matches/:id
// @desc    Update a match (the main scoring engine)
router.put('/:id', auth, async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ msg: 'Match not found' });
        if (match.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // The entire updated match object will be sent from the frontend
        const updatedMatchData = req.body;

        const updatedMatch = await Match.findByIdAndUpdate(
            req.params.id,
            { $set: updatedMatchData },
            { new: true }
        );

        res.json(updatedMatch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/matches/:id
// @desc    Delete a match
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ msg: 'Match not found' });
        }

        // Make sure the user owns the match
        if (match.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Match.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Match removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;