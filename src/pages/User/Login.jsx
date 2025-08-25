import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { UserContext } from "../../context/UserContext";

import Swal from 'sweetalert2';

const OtakuLogin = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const { state, dispatch } = useContext(UserContext);


    const [otakuFormData, setOtakuFormData] = useState({
        userEmail: '',
        userPassword: ''
    });
    const [otakuIsLoading, setOtakuIsLoading] = useState(false);
    const [otakuShowPassword, setOtakuShowPassword] = useState(false);
    const [otakuFormErrors, setOtakuFormErrors] = useState({});
    const [otakuAnimateCards, setOtakuAnimateCards] = useState(false);

    useEffect(() => {
        setOtakuAnimateCards(true);
    }, []);

    const otakuHandleInputChange = (e) => {
        const { name, value } = e.target;
        setOtakuFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (otakuFormErrors[name]) {
            setOtakuFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const otakuValidateForm = () => {
        const errors = {};

        if (!otakuFormData.userEmail) {
            errors.userEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(otakuFormData.userEmail)) {
            errors.userEmail = 'Please enter a valid email';
        }

        if (!otakuFormData.userPassword) {
            errors.userPassword = 'Password is required';
        } else if (otakuFormData.userPassword.length < 6) {
            errors.userPassword = 'Password must be at least 6 characters';
        }

        setOtakuFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const otakuHandleLogin = async (e) => {
        e.preventDefault();

        if (!otakuValidateForm()) {
            return;
        }

        setOtakuIsLoading(true);

        try {
            const response = await fetch('/api/userLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(otakuFormData),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {

                dispatch({ type: "USER", payload: data.user });

                await Swal.fire({
                    title: 'Welcome to Otaku Wave!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'Let\'s Go!',
                    confirmButtonColor: '#8B5CF6',
                    background: isDarkMode ? '#1F2937' : '#FFFFFF',
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                });

                // Redirect to dashboard or home page
                window.location.href = '/UserProfile';
            } else {
                await Swal.fire({
                    title: 'Login Failed',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    confirmButtonColor: '#EF4444',
                    background: isDarkMode ? '#1F2937' : '#FFFFFF',
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
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
            setOtakuIsLoading(false);
        }
    };

    const otakuHandleForgotPassword = () => {
        Swal.fire({
            title: 'Forgot Password?',
            text: 'Enter your email to reset password',
            input: 'email',
            inputPlaceholder: 'Enter your email',
            showCancelButton: true,
            confirmButtonText: 'Send Reset Link',
            confirmButtonColor: '#8B5CF6',
            cancelButtonColor: '#6B7280',
            background: isDarkMode ? '#1F2937' : '#FFFFFF',
            color: isDarkMode ? '#FFFFFF' : '#000000',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter your email!';
                }
                if (!/\S+@\S+\.\S+/.test(value)) {
                    return 'Please enter a valid email!';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Handle password reset logic here
                Swal.fire({
                    title: 'Reset Link Sent!',
                    text: 'Check your email for password reset instructions',
                    icon: 'success',
                    confirmButtonColor: '#8B5CF6',
                    background: isDarkMode ? '#1F2937' : '#FFFFFF',
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                });
            }
        });
    };

        const clientHandleGoogleLogin = () => {
        window.location.href = '/api/auth/google';
    };

    const clientHandleGithubLogin = () => {
        window.location.href = '/api/auth/github';
    };

    return (
        <div className={`otaku-login-container ${isDarkMode ? 'dark' : 'light'}`}>
            {/* Animated Background */}
            <div className="otaku-bg-animation">
                <div className="otaku-floating-element otaku-anime-1"></div>
                <div className="otaku-floating-element otaku-anime-2"></div>
                <div className="otaku-floating-element otaku-anime-3"></div>
                <div className="otaku-floating-element otaku-anime-4"></div>
                <div className="otaku-floating-element otaku-anime-5"></div>
            </div>

            {/* Main Content */}
            <div className="otaku-login-wrapper">
                {/* Left Side - Branding */}
                <div className={`otaku-branding-section ${otakuAnimateCards ? 'otaku-slide-in-left' : ''}`}>
                    <div className="otaku-brand-content">
                        <div className="otaku-logo-container">

                            <h1 className="otaku-brand-title">Testing Website</h1>
                        </div>

                        <div className="otaku-brand-description">
                            <p className="otaku-subtitle">
                                This is a testing website, created only for testing purposes like testing Saas, and other services.
                            </p>
                        </div>

                        <div className="otaku-features-grid">
                            <div className="otaku-feature-card">
                                <div className="otaku-feature-icon">🔌</div>
                                <h3>API Integration</h3>
                                <p>Seamlessly integrate our APIs into your applications</p>
                            </div>
                            <div className="otaku-feature-card">
                                <div className="otaku-feature-icon">📊</div>
                                <h3>Usage Analytics</h3>
                                <p>Monitor your API usage and performance metrics</p>
                            </div>
                            <div className="otaku-feature-card">
                                <div className="otaku-feature-icon">🔒</div>
                                <h3>Secure Access</h3>
                                <p>Enterprise-grade security for all API communications</p>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className={`otaku-form-section ${otakuAnimateCards ? 'otaku-slide-in-right' : ''}`}>
                    <div className="otaku-form-container">
                        <div className="otaku-form-header">
                            <h2 className="otaku-form-title">Log In</h2>
                            <p className="otaku-form-subtitle">Continue your testing process</p>
                        </div>

                        <div className="otaku-login-form">
                            <form onSubmit={otakuHandleLogin} >

                                <div className="otaku-input-group">
                                    <label htmlFor="otaku-email-input" className="otaku-input-label">
                                        Email Address
                                    </label>
                                    <div className="otaku-input-wrapper">
                                        <input
                                            type="email"
                                            id="otaku-email-input"
                                            name="userEmail"
                                            value={otakuFormData.userEmail}
                                            onChange={otakuHandleInputChange}
                                            className={`otaku-form-input ${otakuFormErrors.userEmail ? 'otaku-input-error' : ''}`}
                                            placeholder="testing@gmail.com"
                                            autoComplete="email"
                                        />
                                        <div className="otaku-input-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </div>
                                    </div>
                                    {otakuFormErrors.userEmail && (
                                        <span className="otaku-error-message">{otakuFormErrors.userEmail}</span>
                                    )}
                                </div>

                                <div className="otaku-input-group">
                                    <label htmlFor="otaku-password-input" className="otaku-input-label">
                                        Password
                                    </label>
                                    <div className="otaku-input-wrapper">
                                        <input
                                            type={otakuShowPassword ? "text" : "password"}
                                            id="otaku-password-input"
                                            name="userPassword"
                                            value={otakuFormData.userPassword}
                                            onChange={otakuHandleInputChange}
                                            className={`otaku-form-input ${otakuFormErrors.userPassword ? 'otaku-input-error' : ''}`}
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="otaku-password-toggle"
                                            onClick={() => setOtakuShowPassword(!otakuShowPassword)}
                                        >
                                            {otakuShowPassword ? (
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
                                    {otakuFormErrors.userPassword && (
                                        <span className="otaku-error-message">{otakuFormErrors.userPassword}</span>
                                    )}
                                </div>

                                <div className="otaku-form-options">
                                    <label className="otaku-remember-me">
                                        <input type="checkbox" className="otaku-checkbox" />
                                        <span className="otaku-checkbox-custom"></span>
                                        Remember me
                                    </label>
                                    <button
                                        type="button"
                                        className="otaku-forgot-link"
                                        onClick={otakuHandleForgotPassword}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={otakuIsLoading}
                                    className={`otaku-submit-btn ${otakuIsLoading ? 'otaku-loading' : ''}`}
                                >
                                    {otakuIsLoading ? (
                                        <>
                                            <div className="otaku-loading-spinner"></div>
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>

                            </form>
                        </div>

                        <div className="otaku-form-footer">
                            <p className="otaku-signup-text">
                                New to Testing System?{' '}
                                <a href="/signup" className="otaku-signup-link">
                                    Create Account
                                </a>
                            </p>
                        </div>

                        <div className="otaku-social-login">
                            <div className="otaku-divider">
                                <span>or continue with</span>
                            </div>
                            <div className="otaku-social-buttons">
                                <button className="otaku-social-btn otaku-google-btn"
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
                                <button className="otaku-social-btn otaku-discord-btn"
                                 onClick={clientHandleGithubLogin}
                                >
                                   <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    Github
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default OtakuLogin;