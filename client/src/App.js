// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// --- IMPORT YOUR IMAGES HERE ---
import homeBg from './assets/home-bg.jpg';
import scoreboardBg from './assets/scoreboard-bg.jpeg';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Scoreboard from './pages/Scoreboard';
import HomePage from './pages/HomePage';
import NewMatch from './pages/NewMatch';
import LandingPage from './pages/LandingPage'; // <-- 1. IMPORT THE NEW LANDING PAGE
import './App.css';

const AppWrapper = () => {
    const location = useLocation();
    
    const backgroundStyle = {
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        paddingTop: '1px'
    };

    if (location.pathname.startsWith('/match/')) {
        backgroundStyle.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${scoreboardBg})`;
        backgroundStyle.color = 'white';
    } else {
        backgroundStyle.backgroundImage = `url(${homeBg})`;
    }

    return (
        <div style={backgroundStyle}>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/match/:id" element={<Scoreboard />} />
                    <Route path="/new-match" element={<NewMatch />} />
                    <Route path="/guest" element={<HomePage />} /> {/* <-- 2. GUEST PAGE MOVED HERE */}
                    <Route path="/" element={<LandingPage />} /> {/* <-- 3. LANDING PAGE IS NOW THE DEFAULT */}
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}

export default App;