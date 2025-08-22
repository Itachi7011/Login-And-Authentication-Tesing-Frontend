import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { UserContext } from "../../context/UserContext";

import Swal from 'sweetalert2';

const ClientLogin = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const { state, dispatch } = useContext(UserContext);

    const [clientFormData, setClientFormData] = useState({
        email: '',
        password: ''
    });
    const [clientIsLoading, setClientIsLoading] = useState(false);
    const [clientShowPassword, setClientShowPassword] = useState(false);
    const [clientFormErrors, setClientFormErrors] = useState({});
    const [clientAnimateCards, setClientAnimateCards] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);

    useEffect(() => {
        setClientAnimateCards(true);
    }, []);

    const clientHandleInputChange = (e) => {
        const { name, value } = e.target;
        setClientFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (clientFormErrors[name]) {
            setClientFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const clientValidateForm = () => {
        const errors = {};

        if (!clientFormData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(clientFormData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!isLoginMode) {
            if (!clientFormData.name) {
                errors.name = 'Name is required';
            }

            if (!clientFormData.website) {
                errors.website = 'Website is required';
            } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(clientFormData.website)) {
                errors.website = 'Please enter a valid website URL';
            }
        }

        if (!clientFormData.password) {
            errors.password = 'Password is required';
        } else if (!isLoginMode && clientFormData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        setClientFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const clientHandleLogin = async (e) => {
        e.preventDefault();

        if (!clientValidateForm()) {
            return;
        }

        setClientIsLoading(true);

        try {
            const endpoint = isLoginMode ? '/api/client-auth/login' : '/api/client-auth/register';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientFormData)
            });

            const data = await response.json();

            if (response.ok) {

                const userData = {
                    id: data.data.client.id,
                    name: data.data.client.name,
                    email: data.data.client.email,
                    website: data.data.client.website,
                    apiKey: data.data.client.apiKey,
                    subscription: data.data.client.subscription,
                    token: data.data.token,
                    userType: 'client' // Add user type to distinguish between regular users and clients
                };

                dispatch({ type: "USER", payload: data.userData });

                console.log(data.client)

                // Store client token
                if (typeof (Storage) !== "undefined") {

                    localStorage.setItem('clientToken', data.data.token);
                    localStorage.setItem('client', JSON.stringify(userData));

                }

                await Swal.fire({
                    title: isLoginMode ? 'Welcome Back!' : 'Registration Successful!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'Continue to Dashboard',
                    confirmButtonColor: '#8B5CF6',
                    background: isDarkMode ? '#1F2937' : '#FFFFFF',
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                });

                // Redirect to client dashboard
                window.location.href = '/client-dashboard';
            } else {
                await Swal.fire({
                    title: isLoginMode ? 'Login Failed' : 'Registration Failed',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#EF4444',
                    background: isDarkMode ? '#1F2937' : '#FFFFFF',
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            await Swal.fire({
                title: 'Connection Error',
                text: 'Unable to connect to server. Please try again.',
                icon: 'error',
                confirmButtonText: 'Retry',
                confirmButtonColor: '#EF4444',
                background: isDarkMode ? '#1F2937' : '#FFFFFF',
                color: isDarkMode ? '#FFFFFF' : '#000000'
            });
        } finally {
            setClientIsLoading(false);
        }
    };

    const clientHandleGoogleLogin = () => {
        window.location.href = '/api/client-auth/google';
    };

    const clientHandleGithubLogin = () => {
        window.location.href = '/api/client-auth/github';
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setClientFormErrors({});
    };

    return (
        <div className={`client-login-container ${isDarkMode ? 'dark' : 'light'}`}>
            {/* Animated Background */}
            <div className="client-bg-animation">
                <div className="client-floating-element client-anime-1"></div>
                <div className="client-floating-element client-anime-2"></div>
                <div className="client-floating-element client-anime-3"></div>
                <div className="client-floating-element client-anime-4"></div>
                <div className="client-floating-element client-anime-5"></div>
            </div>

            {/* Main Content */}
            <div className="client-login-wrapper">
                {/* Left Side - Branding */}
                <div className={`client-branding-section ${clientAnimateCards ? 'client-slide-in-left' : ''}`}>
                    <div className="client-brand-content">
                        <div className="client-logo-container">
                        </div>


                        <div className="client-features-grid">
                            <div className="client-feature-card">
                                <div className="client-feature-icon">🔌</div>
                                <h3>API Integration</h3>
                                <p>Seamlessly integrate our APIs into your applications</p>
                            </div>
                            <div className="client-feature-card">
                                <div className="client-feature-icon">📊</div>
                                <h3>Usage Analytics</h3>
                                <p>Monitor your API usage and performance metrics</p>
                            </div>
                            <div className="client-feature-card">
                                <div className="client-feature-icon">🔒</div>
                                <h3>Secure Access</h3>
                                <p>Enterprise-grade security for all API communications</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className={`client-form-section ${clientAnimateCards ? 'client-slide-in-right' : ''}`}>
                    <div className="client-form-container">
                        <div className="client-form-header">
                            <h2 className="client-form-title">{isLoginMode ? 'Client Login' : 'Client Registration'}</h2>
                            <p className="client-form-subtitle">
                                {isLoginMode ? 'Access your API dashboard' : 'Create a new client account'}
                            </p>
                        </div>

                        <div className="client-login-form">
                            <form onSubmit={clientHandleLogin}>
                                {!isLoginMode && (
                                    <>
                                        <div className="client-input-group">
                                            <label htmlFor="client-name-input" className="client-input-label">
                                                Company Name
                                            </label>
                                            <div className="client-input-wrapper">
                                                <input
                                                    type="text"
                                                    id="client-name-input"
                                                    name="name"
                                                    value={clientFormData.name || ''}
                                                    onChange={clientHandleInputChange}
                                                    className={`client-form-input ${clientFormErrors.name ? 'client-input-error' : ''}`}
                                                    placeholder="Enter your company name"
                                                    autoComplete="organization"
                                                />
                                                <div className="client-input-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {clientFormErrors.name && (
                                                <span className="client-error-message">{clientFormErrors.name}</span>
                                            )}
                                        </div>

                                        <div className="client-input-group">
                                            <label htmlFor="client-website-input" className="client-input-label">
                                                Website
                                            </label>
                                            <div className="client-input-wrapper">
                                                <input
                                                    type="url"
                                                    id="client-website-input"
                                                    name="website"
                                                    value={clientFormData.website || ''}
                                                    onChange={clientHandleInputChange}
                                                    className={`client-form-input ${clientFormErrors.website ? 'client-input-error' : ''}`}
                                                    placeholder="https://yourcompany.com"
                                                    autoComplete="url"
                                                />
                                                <div className="client-input-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {clientFormErrors.website && (
                                                <span className="client-error-message">{clientFormErrors.website}</span>
                                            )}
                                        </div>
                                    </>
                                )}

                                <div className="client-input-group">
                                    <label htmlFor="client-email-input" className="client-input-label">
                                        Email Address
                                    </label>
                                    <div className="client-input-wrapper">
                                        <input
                                            type="email"
                                            id="client-email-input"
                                            name="email"
                                            value={clientFormData.email}
                                            onChange={clientHandleInputChange}
                                            className={`client-form-input ${clientFormErrors.email ? 'client-input-error' : ''}`}
                                            placeholder="admin@yourcompany.com"
                                            autoComplete="email"
                                        />
                                        <div className="client-input-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {clientFormErrors.email && (
                                        <span className="client-error-message">{clientFormErrors.email}</span>
                                    )}
                                </div>

                                <div className="client-input-group">
                                    <label htmlFor="client-password-input" className="client-input-label">
                                        Password
                                    </label>
                                    <div className="client-input-wrapper">
                                        <input
                                            type={clientShowPassword ? "text" : "password"}
                                            id="client-password-input"
                                            name="password"
                                            value={clientFormData.password}
                                            onChange={clientHandleInputChange}
                                            className={`client-form-input ${clientFormErrors.password ? 'client-input-error' : ''}`}
                                            placeholder={isLoginMode ? "Enter your password" : "Create a password (min. 8 characters)"}
                                            autoComplete={isLoginMode ? "current-password" : "new-password"}
                                        />
                                        <button
                                            type="button"
                                            className="client-password-toggle"
                                            onClick={() => setClientShowPassword(!clientShowPassword)}
                                        >
                                            {clientShowPassword ? (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {clientFormErrors.password && (
                                        <span className="client-error-message">{clientFormErrors.password}</span>
                                    )}
                                </div>

                                {isLoginMode && (
                                    <div className="client-form-options">
                                        <label className="client-remember-me">
                                            <input type="checkbox" className="client-checkbox" />
                                            <span className="client-checkbox-custom"></span>
                                            Remember me
                                        </label>
                                        <button
                                            type="button"
                                            className="client-forgot-link"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={clientIsLoading}
                                    className={`client-submit-btn ${clientIsLoading ? 'client-loading' : ''}`}
                                >
                                    {clientIsLoading ? (
                                        <>
                                            <div className="client-loading-spinner"></div>
                                            {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                                        </>
                                    ) : (
                                        <>
                                            <span>{isLoginMode ? 'Sign In' : 'Create Account'}</span>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="client-form-footer">
                            <p className="client-signup-text">
                                {isLoginMode ? 'New to Our API Services?' : 'Already have an account?'}{' '}
                                <button
                                    type="button"
                                    className="client-signup-link"
                                    onClick={toggleMode}
                                >
                                    {isLoginMode ? 'Create Account' : 'Sign In'}
                                </button>
                            </p>
                        </div>

                        <div className="client-social-login">
                            <div className="client-divider">
                                <span>or continue with</span>
                            </div>
                            <div className="client-social-buttons">
                                <button
                                    className="client-social-btn client-google-btn"
                                    onClick={clientHandleGoogleLogin}
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </button>
                                <button
                                    className="client-social-btn client-github-btn"
                                    onClick={clientHandleGithubLogin}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    GitHub
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientLogin;