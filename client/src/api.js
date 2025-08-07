import axios from 'axios';

// Create a central instance of axios
const API = axios.create({
    // This uses the environment variable for the deployed backend URL,
    // or falls back to your local server for development.
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

// This is a special function (interceptor) that runs before every API request.
// It checks if a token exists in localStorage and adds it to the request headers.
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers['x-auth-token'] = token;
    }
    return req;
});

export default API;