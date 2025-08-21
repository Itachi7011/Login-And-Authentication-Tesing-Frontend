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
                                <div className="otaku-feature-icon">🎌</div>
                                <h3>Premium Quality</h3>
                                <p>Best Quality Apis and data-services</p>
                            </div>
                            <div className="otaku-feature-card">
                                <div className="otaku-feature-icon">⚡</div>
                                <h3>Lightning Fast</h3>
                                <p>Zero buffering, instant loading</p>
                            </div>
                            <div className="otaku-feature-card">
                                <div className="otaku-feature-icon">🌟</div>
                                <h3>Best Security of Data</h3>
                                <p>All Sensitive is encrypted</p>
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
                                <button className="otaku-social-btn otaku-google-btn">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </button>
                                <button className="otaku-social-btn otaku-discord-btn">
                                    <svg viewBox="0 0 24 24" fill="#5865f2">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                    </svg>
                                    Discord
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