import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // We'll use our main stylesheet

const LandingPage = () => {
    return (
        <div className="landing-container">
            <h1 className="landing-title">Cricket Scorer</h1>
            <p className="landing-subtitle">The ultimate tool for scoring your cricket matches, ball by ball.</p>
            <div className="landing-buttons">
                <Link to="/login">
                    <button className="landing-btn primary">Login or Register</button>
                </Link>
                <Link to="/guest">
                    <button className="landing-btn secondary">Continue as Guest</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;