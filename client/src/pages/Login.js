import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await API.post('/api/users/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Login Failed: Invalid credentials or server error.');
        }
    };

    return (
        <div>
            <form className="form" onSubmit={onSubmit}>
                <h2>Login</h2>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} required />
                <button type="submit">Login</button>
            </form>
            <p style={{color: 'white', marginTop: '15px'}}>
                Don't have an account? <Link to="/register" style={{color: 'cyan'}}>Register here</Link>
            </p>
        </div>
    );
};

export default Login;