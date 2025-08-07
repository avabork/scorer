// client/src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const Dashboard = () => {
    const [matches, setMatches] = useState([]);
    const navigate = useNavigate();

    // 2. Wrap the fetchMatches function in useCallback
    const fetchMatches = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const res = await API.get('/api/matches');
            setMatches(res.data);
        } catch (err) {
            console.error('Could not fetch matches');
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]); // useCallback has its own dependency array

    // 3. Now it is safe to include fetchMatches in this dependency array
    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    const handleDelete = async (matchId) => {
        if (window.confirm('Are you sure you want to delete this match? This cannot be undone.')) {
            try {
                await API.delete(`/api/matches/${matchId}`);
                fetchMatches();
            } catch (err) {
                console.error("Failed to delete match", err);
                alert("Could not delete the match.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <div className="top-right-nav" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <h2 className="dashboard-title">My Matches</h2>
            <Link to="/new-match">
                <button style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '20px' }}>+ Start New Match</button>
            </Link>
            <div>
                {matches.map(match => (
                    <div key={match._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        margin: '10px auto',
                        padding: '10px',
                        width: '90%',
                        maxWidth: '700px',
                        borderRadius: '8px',
                        color: '#333'
                    }}>
                        <Link to={`/match/${match._id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                            <h3>{match.teams[0]} vs {match.teams[1]}</h3>
                            {match.result ? (
                                <p style={{ color: 'green', fontWeight: 'bold' }}>{match.result}</p>
                            ) : (
                                <p>Status: {match.status}</p>
                            )}
                        </Link>
                        <button onClick={() => handleDelete(match._id)} className="delete-btn">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;