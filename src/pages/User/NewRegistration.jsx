import React, { useState, useContext } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Calendar, Globe, Heart, Upload, Check, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../context/ThemeContext';

const NewUserRegistration = () => {
    const { isDarkMode } = useContext(ThemeContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        // clientApiKey: process.env.REACT_APP_CLIENT_API_KEY || '', // Get from environment variables
        acceptTerms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        setPasswordStrength(strength);
    };

    const validateForm = () => {
        const { name, email, password,
            //  clientApiKey,
              acceptTerms } = formData;

        if (!name.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Name Required',
                text: 'Please enter your name',
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000'
            });
            return false;
        }

        if (!email.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Email Required',
                text: 'Please enter your email address',
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000'
            });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address',
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000'
            });
            return false;
        }

        if (password.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Weak Password',
                text: 'Password must be at least 8 characters long',
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000'
            });
            return false;
        }

        // if (!clientApiKey) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Client API Key Missing',
        //         text: 'Please contact administrator',
        //         background: isDarkMode ? '#1a1a2e' : '#ffffff',
        //         color: isDarkMode ? '#ffffff' : '#000000'
        //     });
        //     return false;
        // }

        if (!acceptTerms) {
            Swal.fire({
                icon: 'error',
                title: 'Terms & Conditions',
                text: 'Please accept the terms and conditions',
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000'
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: result.message || 'Please check your email for verification.',
                    background: isDarkMode ? '#1a1a2e' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    confirmButtonColor: '#6366f1'
                }).then(() => {
                    // Redirect to login page
                    window.location.href = '/Login';
                });
            } else {
                // Handle validation errors from backend
                let errorMessage = result.message || 'Something went wrong. Please try again.';
                
                if (result.errors && result.errors.length > 0) {
                    errorMessage = result.errors.map(error => error.msg).join(', ');
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: errorMessage,
                    background: isDarkMode ? '#1a1a1a2e' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000'
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Unable to connect to server. Please try again.',
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 25) return '#ef4444';
        if (passwordStrength <= 50) return '#f59e0b';
        if (passwordStrength <= 75) return '#3b82f6';
        return '#10b981';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 25) return 'Weak';
        if (passwordStrength <= 50) return 'Fair';
        if (passwordStrength <= 75) return 'Good';
        return 'Strong';
    };

    return (
        <div className={`otaku-registration-container ${isDarkMode ? 'dark' : 'light'}`}>
            {/* Background Animation */}
            <div className="otaku-background-animation">
                <div className="otaku-floating-element otaku-sakura-1"></div>
                <div className="otaku-floating-element otaku-sakura-2"></div>
                <div className="otaku-floating-element otaku-star-1"></div>
                <div className="otaku-floating-element otaku-star-2"></div>
            </div>

            <div className="otaku-registration-wrapper">
                {/* Header Section */}
                <div className="otaku-registration-header">
                    <div className="otaku-logo-section">
                        <h1 className="otaku-main-title">Join Otaku Wave</h1>
                    </div>
                </div>

                {/* Main Registration Form */}
                <div className="otaku-registration-card">
                    <form onSubmit={handleSubmit} className="otaku-registration-form">
                        {/* Personal Information */}
                        <div className="otaku-signup-form-section">
                            <h3 className="otaku-section-title">
                                <Heart className="otaku-section-icon" />
                                Personal Information
                            </h3>

                            <div className="otaku-form-grid">
                                <div className="otaku-form-group">
                                    <label className="otaku-form-label" htmlFor="otaku-name-input">
                                        Full Name
                                    </label>
                                    <div className="otaku-input-wrapper">
                                        <User className="otaku-input-icon" />
                                        <input
                                            id="otaku-name-input"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="otaku-form-input"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="otaku-form-group">
                                    <label className="otaku-form-label" htmlFor="otaku-email-input">
                                        Email Address
                                    </label>
                                    <div className="otaku-input-wrapper">
                                        <Mail className="otaku-input-icon" />
                                        <input
                                            id="otaku-email-input"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="otaku-form-input"
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="otaku-signup-form-section">
                            <h3 className="otaku-section-title">
                                <Eye className="otaku-section-icon" />
                                Account Security
                            </h3>

                            <div className="otaku-form-grid">
                                <div className="otaku-form-group">
                                    <label className="otaku-form-label" htmlFor="otaku-password-input">
                                        Password
                                    </label>
                                    <div className="otaku-input-wrapper">
                                        <input
                                            id="otaku-password-input"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="otaku-form-input"
                                            placeholder="Create a strong password (min. 8 characters)"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="otaku-password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <div className="otaku-password-strength">
                                            <div className="otaku-strength-bar">
                                                <div
                                                    className="otaku-strength-fill"
                                                    style={{
                                                        width: `${passwordStrength}%`,
                                                        backgroundColor: getPasswordStrengthColor()
                                                    }}
                                                ></div>
                                            </div>
                                            <span
                                                className="otaku-strength-text"
                                                style={{ color: getPasswordStrengthColor() }}
                                            >
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hidden client API key field (can be populated from env vars) */}
                        <input
                            type="hidden"
                            name="clientApiKey"
                            // value={formData.clientApiKey}
                            value="a5fds8f451asd3f21sdf82asdf"
                        />

                        {/* Terms and Submit */}
                        <div className="otaku-signup-form-section">
                            <div className="otaku-terms-section">
                                <label className="otaku-checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleInputChange}
                                        className="otaku-checkbox-input"
                                        required
                                    />
                                    <span className="otaku-checkbox-custom"></span>
                                    <span className="otaku-checkbox-text">
                                        I accept the <a href="/terms" className="otaku-link">Terms & Conditions</a> and
                                        <a href="/privacy" className="otaku-link"> Privacy Policy</a>
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`otaku-submit-button ${isSubmitting ? 'otaku-submitting' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="otaku-spinner"></div>
                                        Creating Your Account...
                                    </>
                                ) : (
                                    <>
                                        <User className="otaku-button-icon" />
                                        Join Otaku Wave
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="otaku-login-link-section">
                            <p className="otaku-login-text">
                                Already have an account?
                                <a href="/Login" className="otaku-login-link"> Log In Here</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewUserRegistration;