// client/src/pages/Scoreboard.js
import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useParams, Link } from 'react-router-dom';
import Celebration from '../components/Fireworks';

// --- NEW SCORING PANEL COMPONENT ---
const ScoringPanel = ({ onScore }) => {
    const [runs, setRuns] = useState(0);
    const [isWicket, setIsWicket] = useState(false);
    const [isNoBall, setIsNoBall] = useState(false);
    const [isWide, setIsWide] = useState(false);

    const handleSubmit = () => {
        onScore({
            runs,
            isWicket,
            isExtra: isNoBall || isWide,
        });
        // Reset panel after submitting
        setRuns(0);
        setIsWicket(false);
        setIsNoBall(false);
        setIsWide(false);
    };

    return (
        <div className="controls">
            <h3>Score This Ball</h3>
            <div>
                <strong>Runs:</strong>
                {[0, 1, 2, 3, 4, 5, 6].map(r => (
                    <button key={r} onClick={() => setRuns(r)} style={{backgroundColor: runs === r ? '#007bff' : ''}}>{r}</button>
                ))}
            </div>
            <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <label><input type="checkbox" checked={isWicket} onChange={() => setIsWicket(!isWicket)} /> Wicket?</label>
                <label><input type="checkbox" checked={isNoBall} onChange={() => setIsNoBall(!isNoBall)} /> No Ball?</label>
                <label><input type="checkbox" checked={isWide} onChange={() => setIsWide(!isWide)} /> Wide?</label>
            </div>
            <button onClick={handleSubmit} style={{width: '100%', padding: '12px', fontSize: '18px', backgroundColor: '#28a745', color: 'white'}}>Submit Ball</button>
        </div>
    );
};


const Scoreboard = () => {
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const fetchMatch = useCallback(async () => {
        // ... (this function remains the same)
        setLoading(true);
        try {
            if (!localStorage.getItem('token')) return setLoading(false);
            const res = await API.get(`/api/matches/${id}`);
            setMatch(res.data);
        } catch (err) {
            console.error("Could not fetch match data. Error:", err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchMatch();
    }, [fetchMatch]);

    // --- REWRITTEN SCORING LOGIC ---
    const handleScoreUpdate = async (scoreEvent) => {
        const { runs, isWicket, isExtra } = scoreEvent;
        if (match.status === 'Finished') return alert("This match has already finished.");

        let updatedMatch = JSON.parse(JSON.stringify(match));

        if (updatedMatch.status === 'Innings Break') {
            updatedMatch.status = 'In Progress';
        }
        
        const innings = updatedMatch.innings[updatedMatch.currentInnings];

        innings.score += runs;
        if (isExtra) innings.score += 1;
        if (isWicket) innings.wickets += 1;

        if (!isExtra) innings.ballCountInOver += 1;
        if (innings.ballCountInOver === 6) {
            innings.oversCompleted += 1;
            innings.ballCountInOver = 0;
        }

        // ... (End of innings logic remains the same)
        let inningsIsOver = innings.wickets >= updatedMatch.totalWickets || innings.oversCompleted >= updatedMatch.overs;
        if (inningsIsOver) {
            innings.isFinished = true;
            if (updatedMatch.currentInnings === 1) {
                updatedMatch.status = 'Innings Break';
                updatedMatch.target = innings.score + 1;
                updatedMatch.currentInnings = 2;
                alert(`End of 1st Innings! Target to win is ${updatedMatch.target}`);
            } else {
                updatedMatch.status = 'Finished';
                if (innings.score >= updatedMatch.target) updatedMatch.result = `${innings.battingTeam} won by ${updatedMatch.totalWickets - innings.wickets} wickets.`;
                else if (innings.score === updatedMatch.target - 1) updatedMatch.result = "Match Tied.";
                else updatedMatch.result = `${innings.bowlingTeam} won by ${updatedMatch.target - 1 - innings.score} runs.`;
            }
        }
        if (updatedMatch.currentInnings === 2 && innings.score >= updatedMatch.target && updatedMatch.status !== 'Finished') {
            innings.isFinished = true;
            updatedMatch.status = 'Finished';
            updatedMatch.result = `${innings.battingTeam} won by ${updatedMatch.totalWickets - innings.wickets} wickets.`;
        }
        
        try {
            const res = await API.put(`/api/matches/${id}`, updatedMatch);
            setMatch(res.data);
        } catch (err) {
            alert('Failed to update score.');
        }
    };
    
    // ... (rest of the component's JSX rendering)
    if (loading) return <div>Loading Match...</div>;
    if (!match || !match.innings) return <div>Match not found or has an old data structure. Please create a new match. <br/> <Link to="/dashboard">Back to Dashboard</Link></div>;

    const currentInningsData = match.innings[match.currentInnings];
    const firstInningsData = match.innings['1'];
    const winner = match.status === 'Finished' ? match.result : null;

    return (
        <>
            {winner && <Celebration />}
            <div className="scoreboard">
                <h2>{match.teams[0]} vs {match.teams[1]}</h2>
                <hr/>
                <h4>Innings {match.currentInnings}</h4>
                <h3>{currentInningsData.battingTeam} is batting</h3>
                <h1>{currentInningsData.score} / {currentInningsData.wickets}</h1>
                <p>Overs: <strong>{currentInningsData.oversCompleted}.{currentInningsData.ballCountInOver}</strong> / {match.overs}</p>
                {match.target > 0 && <h4>Target: {match.target}</h4>}
                
                <p>Status: <span style={{fontWeight: 'bold'}}>{match.status}</span></p>
                {firstInningsData.isFinished && <p>1st Innings: {firstInningsData.score}/{firstInningsData.wickets}</p>}
                {winner && <h2 style={{color: 'green'}}>{winner}</h2>}

                {match.status === 'Innings Break' && (
                    <button onClick={() => handleScoreUpdate({runs: 0, isWicket: false, isExtra: false})} style={{padding: '15px', fontSize: '18px', backgroundColor: 'green', color: 'white'}}>Start 2nd Innings</button>
                )}

                {match.status === 'In Progress' && (
                     <ScoringPanel onScore={handleScoreUpdate} />
                )}

                <Link to="/dashboard"><button style={{ marginTop: '20px' }}>Back to Dashboard</button></Link>
            </div>
        </>
    );
};

export default Scoreboard;