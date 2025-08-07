import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // <-- THE FIX: Use the central API instance

const NewMatch = () => {
    const [formData, setFormData] = useState({
        team1: '',
        team2: '',
        overs: 20,
        totalWickets: 10,
        tossWinner: '',
        decision: ''
    });
    const navigate = useNavigate();

    const { team1, team2, overs, totalWickets, tossWinner, decision } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (!tossWinner || !decision) {
            alert('Please select the toss winner and their decision.');
            return;
        }

        const newMatchData = {
            teams: [team1, team2],
            overs: parseInt(overs),
            totalWickets: parseInt(totalWickets),
            tossWinner,
            decision
        };

        try {
            // THE FIX: Use API.post instead of axios.post
            const res = await API.post('/api/matches', newMatchData);
            navigate(`/match/${res.data._id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to create match.');
        }
    };

    return (
        <form className="form" onSubmit={onSubmit}>
            <h2>New Match Setup</h2>

            <input type="text" placeholder="Team 1 Name" name="team1" value={team1} onChange={onChange} required />
            <input type="text" placeholder="Team 2 Name" name="team2" value={team2} onChange={onChange} required />

            <label>Total Overs:</label>
            <input type="number" name="overs" value={overs} onChange={onChange} required />

            <label>Total Wickets:</label>
            <input type="number" name="totalWickets" value={totalWickets} onChange={onChange} required />

            {team1 && team2 && (
                <>
                    <div>
                        <label>Toss Winner:</label>
                        <select name="tossWinner" value={tossWinner} onChange={onChange} required>
                            <option value="">-- Select Toss Winner --</option>
                            <option value={team1}>{team1}</option>
                            <option value={team2}>{team2}</option>
                        </select>
                    </div>
                    <div>
                        <label>Decision:</label>
                        <select name="decision" value={decision} onChange={onChange} required>
                            <option value="">-- Select Decision --</option>
                            <option value="bat">Bat</option>
                            <option value="field">Field</option>
                        </select>
                    </div>
                </>
            )}

            <button type="submit">Start Match</button>
        </form>
    );
};

export default NewMatch;