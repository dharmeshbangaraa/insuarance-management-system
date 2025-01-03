import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage: React.FC = () => {
    const [emailId, setEmailId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

     const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
    
            if (!emailId || !password) {
                setError('All fields are required');
                setSuccess(null);
                return;
            }
    
            if (!/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/i.test(emailId)) {
                setError('Invalid email format');
                setSuccess(null);
                return;
            }
    
            if (password.length < 8) {
                setError('Password must be at least 8 characters');
                setSuccess(null);
                return;
            }
    
            setError(null);
    
            try {
                const response = await fetch('http://localhost:8081/api/v1/customer/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        emailId,
                        password,
                    }),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setSuccess('Login successful!');
                    console.log('Server response:', data);
                    navigate('/home');
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Login failed');
                    setSuccess(null);
                }
            } catch (err) {
                setError('An error occurred while sending the request');
                setSuccess(null);
            }
        };

        return (
            <div className="container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="form">
                    <div className="inputGroup">
                        <label htmlFor="emailId">Email:</label>
                        <input
                            type="email"
                            id="emailId"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <button type="submit" className="button">Login</button>
                </form>
            </div>
        );
};

export default LoginPage;