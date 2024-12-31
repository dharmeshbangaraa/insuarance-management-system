import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const RegistrationPage: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [contactNumber, setContactNumber] = useState<string>('');
    const [dateOfBirth, setDateOfBirth] = useState<string>('');
    const [emailId, setEmailId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !contactNumber || !dateOfBirth || !emailId || !password) {
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
            const response = await fetch('http://localhost:8081/api/v1/customer/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    contactNumber,
                    dateOfBirth,
                    emailId,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess('Registration successful!');
                console.log('Server response:', data);
                navigate('/success');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed');
                setSuccess(null);
            }
        } catch (err) {
            setError('An error occurred while sending the request');
            setSuccess(null);
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="inputGroup">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input
                        type="text"
                        id="contactNumber"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="input"
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="input"
                    />
                </div>
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
                <button type="submit" className="button">Register</button>
            </form>
        </div>
    );
};

export default RegistrationPage;
