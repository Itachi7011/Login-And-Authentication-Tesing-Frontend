import React, { useState, useContext } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Calendar, Globe, Heart, Upload, Check, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../context/ThemeContext';

const NewUserRegistration = () => {
    const { isDarkMode } = useContext(ThemeContext);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        avatar: null,
        acceptTerms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const defaultAvatars = {
        male: "https://cdn.pixabay.com/photo/2013/07/12/15/24/goaty-149860_960_720.png",
        female: "https://cdn.pixabay.com/photo/2023/03/31/05/52/avatar-7889246_960_720.jpg",
        other: "https://cdn.pixabay.com/photo/2016/10/04/14/40/gender-1714479_960_720.jpg"
    };

    const animeAvatars = [
        "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",  // Girl
        "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",  // Boy
        "https://cdn-icons-png.flaticon.com/512/706/706830.png",    // Girl
        "https://cdn-icons-png.flaticon.com/512/4333/4333607.png",  // Boy
        "https://cdn-icons-png.flaticon.com/512/4202/4202843.png",  // Girl
        "https://cdn-icons-png.flaticon.com/512/4333/4333603.png"   // Boy
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'password') {
            calculatePasswordStrength(value);
        }

        if (name === 'gender' && value) {
            if (!selectedAvatar) {
                setSelectedAvatar(defaultAvatars[value] || defaultAvatars.other);
            }
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

    const handleAvatarSelect = (avatarUrl) => {
        setSelectedAvatar(avatarUrl);
        setFormData(prev => ({ ...prev, avatar: avatarUrl }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedAvatar(event.target.result);
                setFormData(prev => ({ ...prev, avatar: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const { username, email, password, confirmPassword, gender, acceptTerms } = formData;

        if (!username.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Username Required',
                text: 'Please enter a username',
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

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match',
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000'
            });
            return false;
        }

        if (!gender) {
            Swal.fire({
                icon: 'error',
                title: 'Gender Required',
                text: 'Please select your gender',
                background: isDarkMode ? '#1a1a2e' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000'
            });
            return false;
        }

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
        console.log("button Pressed")

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const submitData = new FormData();

            // Map form data to backend expected format
            submitData.append('username', formData.username);
            submitData.append('email', formData.email);
            submitData.append('password', formData.password);
            submitData.append('confirmPassword', formData.confirmPassword);
            submitData.append('gender', formData.gender);

            // Handle avatar
            if (formData.avatar && typeof formData.avatar === 'object') {
                submitData.append('userImage', formData.avatar);
            } else {
                submitData.append('defaultAvatar', selectedAvatar);
            }

            const response = await fetch('/api/newUserRegistration', {
                method: 'POST',
                body: submitData
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'Welcome to Otaku Wave! Please check your email for verification.',
                    background: isDarkMode ? '#1a1a2e' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    confirmButtonColor: '#6366f1'
                }).then(() => {
                    // Redirect to login or email verification page
                    window.location.href = '/Login';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: result.message || 'Something went wrong. Please try again.',
                    background: isDarkMode ? '#1a1a2e' : '#ffffff',
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
                <div className="otaku-floating-element otaku-sakura-3"></div>
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
                        <div className="otaku-registration-form">
                            {/* Avatar Selection Section */}
                            <div className="otaku-signup-form-section otaku-avatar-section">
                                <h3 className="otaku-section-title">
                                    <User className="otaku-section-icon" />
                                    Choose Your Avatar
                                </h3>

                                <div className="otaku-avatar-display">
                                    <div className="otaku-current-avatar">
                                        <img
                                            src={selectedAvatar || defaultAvatars.other}
                                            alt="Selected Avatar"
                                            className="otaku-avatar-preview"
                                        />
                                    </div>
                                </div>

                                <div className="otaku-avatar-options">
                                    <div className="otaku-avatar-grid">
                                        {animeAvatars.map((avatar, index) => (
                                            <div
                                                key={index}
                                                className={`otaku-avatar-option ${selectedAvatar === avatar ? 'otaku-selected' : ''}`}
                                                onClick={() => handleAvatarSelect(avatar)}
                                            >
                                                <img src={avatar} alt={`Avatar ${index + 1}`} />
                                                {selectedAvatar === avatar && <Check className="otaku-check-icon" />}
                                            </div>
                                        ))}
                                    </div>


                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="otaku-signup-form-section">
                                <h3 className="otaku-section-title">
                                    <Heart className="otaku-section-icon" />
                                    Personal Information
                                </h3>

                                <div className="otaku-form-grid">
                                    <div className="otaku-form-group">
                                        <label className="otaku-form-label" htmlFor="otaku-username-input">
                                            Username
                                        </label>
                                        <div className="otaku-input-wrapper">
                                            <User className="otaku-input-icon" />
                                            <input
                                                id="otaku-username-input"
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className="otaku-form-input"
                                                placeholder="Enter your unique username"
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

                                    <div className="otaku-form-group">
                                        <label className="otaku-form-label" htmlFor="otaku-gender-select">
                                            Gender
                                        </label>
                                        <div className="otaku-input-wrapper">
                                            <Globe className="otaku-input-icon" />
                                            <select
                                                id="otaku-gender-select"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="otaku-form-select"
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
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
                                                placeholder="Create a strong password"
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

                                    <div className="otaku-form-group">
                                        <label className="otaku-form-label" htmlFor="otaku-confirm-password-input">
                                            Confirm Password
                                        </label>
                                        <div className="otaku-input-wrapper">
                                            <input
                                                id="otaku-confirm-password-input"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="otaku-form-input"
                                                placeholder="Confirm your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="otaku-password-toggle"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                            {formData.confirmPassword && (
                                                <div className="otaku-password-match">
                                                    {formData.password === formData.confirmPassword ? (
                                                        <Check className="otaku-match-icon otaku-match-success" />
                                                    ) : (
                                                        <X className="otaku-match-icon otaku-match-error" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                        </div>
                    </form>

                </div>


            </div>
        </div>
    );
};

export default NewUserRegistration;