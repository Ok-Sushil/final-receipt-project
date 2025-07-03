import React, { useState, useEffect } from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('username');
    }, []);

    const handleLogin = async () => {
        if (!username || !code) {
            alert('Please enter both username and code');
            return;
        }
        try {
            const res = await API.post('/auth/login', { username, code });
            localStorage.setItem('username', res.data.username);

            if (res.data.role === 'admin') navigate('/admin');
            else navigate('/user');
        } catch {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>

                <input 
                    type="text"
                    placeholder="Username"
                    className="login-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input 
                    type="text"
                    placeholder="Code"
                    className="login-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <button 
                    onClick={handleLogin}
                    className="login-button"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
