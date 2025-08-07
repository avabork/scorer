// client/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Celebration from '../components/Fireworks';

// --- REUSABLE ADVANCED SCORING PANEL ---
const GuestScoringPanel = ({ onScore }) => {
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
                    <button key={r} onClick={() => setRuns(r)} style={{backgroundColor: runs === r ? '#007bff' : '', color: runs === r ? 'white' : 'black'}}>{r}</button>
                ))}
            </div>
            <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <label style={{cursor: 'pointer'}}><input type="checkbox" checked={isWicket} onChange={() => setIsWicket(!isWicket)} /> Wicket?</label>
                <label style={{cursor: 'pointer'}}><input type="checkbox" checked={isNoBall} onChange={() => setIsNoBall(!isNoBall)} /> No Ball?</label>
                <label style={{cursor: 'pointer'}}><input type="checkbox" checked={isWide} onChange={() => setIsWide(!isWide)} /> Wide?</label>
            </div>
            <button onClick={handleSubmit} style={{width: '100%', padding: '12px', fontSize: '18px', backgroundColor: '#28a745', color: 'white'}}>Submit Ball</button>
        </div>
    );
};


const HomePage = () => {
    const [guestMatch, setGuestMatch] = useState(null);
    const [setupData, setSetupData] = useState({ team1: '', team2: '', overs: 20, totalWickets: 10, battingTeam: '' });

    useEffect(() => {
        try {
            const savedMatch = localStorage.getItem('guestMatch');
            if (savedMatch) { setGuestMatch(JSON.parse(savedMatch)); }
        } catch (error) { localStorage.removeItem('guestMatch'); }
    }, []);

    const handleSetupChange = e => setSetupData({ ...setupData, [e.target.name]: e.target.value });

    const handleSetupSubmit = e => {
        e.preventDefault();
        const { team1, team2, overs, totalWickets, battingTeam } = setupData;
        if (!battingTeam) return alert('Please select which team is batting first.');
        const bowlingTeam = team1 === battingTeam ? team2 : team1;
        const newMatchData = {
            teams: [team1, team2], overs: parseInt(overs), totalWickets: parseInt(totalWickets),
            status: 'In Progress', currentInnings: 1, target: 0, result: '',
            innings: {
                '1': { battingTeam, bowlingTeam, score: 0, wickets: 0, oversCompleted: 0, ballCountInOver: 0, isFinished: false },
                '2': { battingTeam: bowlingTeam, bowlingTeam: battingTeam, score: 0, wickets: 0, oversCompleted: 0, ballCountInOver: 0, isFinished: false }
            }
        };
        localStorage.setItem('guestMatch', JSON.stringify(newMatchData));
        setGuestMatch(newMatchData);
    };

    const handleGuestScoreUpdate = (scoreEvent) => {
        const { runs, isWicket, isExtra } = scoreEvent;
        if (!guestMatch || guestMatch.status === 'Finished') return;
        
        let updatedMatch = JSON.parse(JSON.stringify(guestMatch));

        if (updatedMatch.status === 'Innings Break') {
            updatedMatch.status = 'In Progress';
        }

        const innings = updatedMatch.innings[updatedMatch.currentInnings];
        
        // --- THIS IS THE FIX for the [object Object] bug ---
        // Ensure score is always treated as a number
        innings.score = Number(innings.score) + Number(runs);
        
        if (isExtra) innings.score += 1;
        if (isWicket) innings.wickets += 1;
        if (!isExtra) innings.ballCountInOver += 1;

        if (innings.ballCountInOver === 6) {
            innings.oversCompleted += 1;
            innings.ballCountInOver = 0;
        }
        
        let inningsIsOver = innings.wickets >= updatedMatch.totalWickets || innings.oversCompleted >= updatedMatch.overs;
        if (inningsIsOver && !innings.isFinished) {
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

        if (updatedMatch.currentInnings === 2 && innings.score >= updatedMatch.target && !innings.isFinished) {
            innings.isFinished = true;
            updatedMatch.status = 'Finished';
            updatedMatch.result = `${innings.battingTeam} won by ${updatedMatch.totalWickets - innings.wickets} wickets.`;
        }
        
        localStorage.setItem('guestMatch', JSON.stringify(updatedMatch));
        setGuestMatch(updatedMatch);
    };

    const endGuestMatch = () => {
        localStorage.removeItem('guestMatch');
        setGuestMatch(null);
        setSetupData({ team1: '', team2: '', overs: 20, totalWickets: 10, battingTeam: '' });
    };

    if (guestMatch && guestMatch.innings) {
        const currentInningsData = guestMatch.innings[guestMatch.currentInnings];
        return (
            <>
                {guestMatch.result && <Celebration />}
                <div className="top-right-nav" style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                    <Link to="/login"><button>Login</button></Link>
                    <Link to="/register"><button>Register</button></Link>
                </div>
                <div className="scoreboard">
                    <h2>Guest Match: {guestMatch.teams[0]} vs {guestMatch.teams[1]}</h2>
                    <h3>{currentInningsData.battingTeam} is batting</h3>
                    <h1>{currentInningsData.score} / {currentInningsData.wickets}</h1>
                    <p>Overs: <strong>{currentInningsData.oversCompleted}.{currentInningsData.ballCountInOver}</strong> / {guestMatch.overs}</p>
                    {guestMatch.target > 0 && <h4>Target: {guestMatch.target}</h4>}
                    <p>Status: <span style={{ fontWeight: 'bold' }}>{guestMatch.status}</span></p>
                    {guestMatch.result && <h2 style={{ color: 'white' }}>{guestMatch.result}</h2>}

                    {guestMatch.status === 'Innings Break' && (
                        <button onClick={() => handleGuestScoreUpdate({runs: 0, isWicket: false, isExtra: false})} style={{padding: '15px', fontSize: '18px', backgroundColor: 'green', color: 'white'}}>Start 2nd Innings</button>
                    )}

                    {guestMatch.status === 'In Progress' && (
                        // --- NOW USING THE ADVANCED SCORING PANEL ---
                        <GuestScoringPanel onScore={handleGuestScoreUpdate} />
                    )}
                    <button onClick={endGuestMatch} style={{ marginTop: '20px' }}>End & Start New Guest Match</button>
                </div>
            </>
        );
    } else {
        // ... (The setup form JSX remains the same)
        return ( 
            <div>
                 <div className="top-right-nav" style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                    <Link to="/login"><button>Login</button></Link>
                    <Link to="/register"><button>Register</button></Link>
                 </div>
                <h2 style={{color: 'white', textShadow: '1px 1px 4px rgba(0,0,0,0.8)'}}>Start a New Guest Match</h2>
                <p style={{color: 'white', textShadow: '1px 1px 4px rgba(0,0,0,0.8)'}}>Your progress will be saved in this browser only. Log in to save matches permanently.</p>
                <form className="form" onSubmit={handleSetupSubmit}>
                    <input type="text" placeholder="Team 1 Name" name="team1" value={setupData.team1} onChange={handleSetupChange} required />
                    <input type="text" placeholder="Team 2 Name" name="team2" value={setupData.team2} onChange={handleSetupChange} required />
                    <label>Total Overs:</label>
                    <input type="number" name="overs" value={setupData.overs} onChange={handleSetupChange} required />
                    <label>Total Wickets:</label>
                    <input type="number" name="totalWickets" value={setupData.totalWickets} onChange={handleSetupChange} required />
                    {setupData.team1 && setupData.team2 && (
                        <div>
                            <label>Who will bat first?</label>
                            <select name="battingTeam" value={setupData.battingTeam} onChange={handleSetupChange} required>
                                <option value="">-- Select Team --</option>
                                <option value={setupData.team1}>{setupData.team1}</option>
                                <option value={setupData.team2}>{setupData.team2}</option>
                            </select>
                        </div>
                    )}
                    <button type="submit">Start Guest Match</button>
                </form>
            </div>
        );
    }
};

export default HomePage;
