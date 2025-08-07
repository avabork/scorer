import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await API.post('/api/users/register', formData);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response) {
                alert(err.response.data.msg || 'Registration failed.');
            } else {
                alert('Registration failed. Cannot connect to the server.');
            }
        }
    };

    return (
        <div>
            <form className="form" onSubmit={onSubmit}>
                <h2>Register a New Account</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={onChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={onChange}
                    required
                    minLength="6"
                />
                <button type="submit">Register</button>
            </form>
            <p style={{color: 'white', marginTop: '15px'}}>
                Already have an account? <Link to="/login" style={{color: 'cyan'}}>Login here</Link>
            </p>
        </div>
    );
};

export default Register;