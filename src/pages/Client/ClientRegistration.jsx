import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Globe, Building2, FileText, Clock, Mail, Shield, CheckCircle, AlertCircle, Palette } from 'lucide-react';
import Swal from 'sweetalert2';
const ClientSignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    website: '',
    description: '',
    branding: {
      companyName: '',
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedClient, setGeneratedClient] = useState(null);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const showAlert = (type, title, text) => {
    if (type === 'success') {
      Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonColor: '#3085d6',
      });
    } else if (type === 'error') {
      Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonColor: '#d33',
      });
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('branding.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        branding: {
          ...prev.branding,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.website.trim()) {
      newErrors.website = 'Website URL is required';
    } else {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = 'Please provide a valid website URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert('error', 'Validation Error', 'Please fix the errors and try again.');
      return;
    }

    setLoading(true);

    try {
      // Clean up empty branding fields
      const cleanedData = {
        ...formData,
        branding: {
          ...(formData.branding.companyName && { companyName: formData.branding.companyName }),
        }
      };

      const response = await fetch('/api/clients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setGeneratedClient(data.data.client);

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          html: `Your account has been created successfully. Please check your email for verification OTP.<br><br>
           <strong>API Key:</strong> ${data.data.client.apiKey}<br>
           <em>(Please save this securely)</em>`,
          confirmButtonColor: '#3085d6',
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          website: '',
          description: '',
          branding: {
            companyName: '',
          }
        });

      } else {
        // Handle API validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const apiErrors = {};
          data.errors.forEach(error => {
            apiErrors[error.path] = error.msg;
          });
          setErrors(apiErrors);
          throw new Error('Please fix the validation errors');
        }
        throw new Error(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering client:', error);
      Swal.fire({
    icon: 'error',
    title: 'Registration Failed',
    text: error.message || 'Something went wrong. Please try again.',
    confirmButtonColor: '#d33',
  });
  
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`client-signup-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="client-signup-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <header className="client-signup-header">
        <div className="header-content">
          <h1 className="brand-title">
            <Shield className="brand-icon" />
            Login & Auth
          </h1>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="client-signup-main">
        <div className="client-signup-card">
          <div className="card-header">
            <div className="header-icon">
              <Building2 className="icon" />
            </div>
            <h2 className="card-title">Register Your Application</h2>
            <p className="card-subtitle">
              Create a new client to integrate with our authentication service
            </p>
          </div>

          <div className="client-signup-form">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">
                <Building2 className="section-icon" />
                Basic Information
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="client-name-input">
                  Name *
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <span className="error-message">
                    <AlertCircle className="error-icon" />
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="client-email-input">
                  Email *
                </label>
                <div className="input-with-icon">
                  <Mail className="input-icon" />
                  <input
                    id="client-email-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input with-icon ${errors.email ? 'error' : ''}`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <span className="error-message">
                    <AlertCircle className="error-icon" />
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="client-password-input">
                  Password *
                </label>
                <div className="input-with-icon">
                  <Shield className="input-icon" />
                  <input
                    id="client-password-input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input with-icon ${errors.password ? 'error' : ''}`}
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">
                    <AlertCircle className="error-icon" />
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="client-website-input">
                  Website URL *
                </label>
                <div className="input-with-icon">
                  <Globe className="input-icon" />
                  <input
                    id="client-website-input"
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className={`form-input with-icon ${errors.website ? 'error' : ''}`}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                {errors.website && (
                  <span className="error-message">
                    <AlertCircle className="error-icon" />
                    {errors.website}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="client-description-input">
                  Description
                </label>
                <div className="input-with-icon">
                  <FileText className="input-icon" />
                  <textarea
                    id="client-description-input"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea with-icon"
                    placeholder="Brief description of your application..."
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Branding Configuration */}
            <div className="form-section">
              <h3 className="section-title">
                <Palette className="section-icon" />
                Branding (Optional)
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="branding-company-input">
                  Company Name
                </label>
                <input
                  id="branding-company-input"
                  type="text"
                  name="branding.companyName"
                  value={formData.branding.companyName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Your company name"
                />
              </div>


            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <CheckCircle className="btn-icon" />
                    Register
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="client-signup-footer">
        <p>&copy; 2024 Login & Auth. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ClientSignupPage;