import React, { useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';

interface AuthResponse {
    username?: string;
    token?: string;
    error?: string;
}

const AuthPage: React.FC = () => {
    const [loginFormData, setLoginFormData] = useState({ username: '', password: '' });
    const [registerFormData, setRegisterFormData] = useState({ username: '', password: '' });
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const onLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4001/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginFormData),
            });
            const data: AuthResponse = await response.json();
            if (response.status === 200) {
                localStorage.setItem('token', data.token!);
                localStorage.setItem('username', data.username!);
                navigate("/")
            } else {
                setSnackbarMessage(data.error || 'Error in login');
            }
        } catch (error) {
            setSnackbarMessage(error.toString());
        }
    };

    const onRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4001/account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerFormData),
            });
            const data: AuthResponse = await response.json();
            if (response.status === 201) {
                setSnackbarMessage('Account created');
            } else {
                setSnackbarMessage(data.error || 'Error creating the account');
            }
        } catch (error) {
            console.error('Error creating the account:', error);
            setSnackbarMessage('Error creating the account');
        }
    };

    return (
        <div className="auth">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={onLoginSubmit}>
                    <div>
                        <label htmlFor="login-email">Username:</label>
                        <input type="text" id="login-email" name="username" value={loginFormData.username} onChange={handleLoginChange} />
                    </div>
                    <div>
                        <label htmlFor="login-password">Password:</label>
                        <input type="password" id="login-password" name="password" value={loginFormData.password} onChange={handleLoginChange} />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
            <div className="register-form">
                <h2>Register</h2>
                <form onSubmit={onRegisterSubmit}>
                    <div>
                        <label htmlFor="register-name">Username:</label>
                        <input type="text" id="register-name" name="username" value={registerFormData.username} onChange={handleRegisterChange} />
                    </div>
                    <div>
                        <label htmlFor="register-password">Password:</label>
                        <input type="password" id="register-password" name="password" value={registerFormData.password} onChange={handleRegisterChange} />
                    </div>
                    <button type="submit">Create account</button>
                </form>
            </div>
            {snackbarMessage && (
                <div className="snackbar">{snackbarMessage}</div>
            )}
        </div>
    );
}

export default AuthPage;
