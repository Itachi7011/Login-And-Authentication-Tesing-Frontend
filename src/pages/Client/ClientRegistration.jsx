import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Globe, Building2, FileText, Clock, Mail, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const ClientSignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    allowedDomains: [''],
    redirectUris: [''],
    otpTemplate: {
      subject: 'Your Verification Code',
      message: 'Your OTP is: {otp}. Valid for {expiration} minutes.',
      expiration: 10
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
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
    // Using browser's built-in alert for now - you can replace with SweetAlert2 in your implementation
    if (type === 'success') {
      alert(`${title}: ${text}`);
    } else if (type === 'error') {
      alert(`Error - ${title}: ${text}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('otpTemplate.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        otpTemplate: {
          ...prev.otpTemplate,
          [field]: field === 'expiration' ? parseInt(value) || 10 : value
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

  const handleArrayInputChange = (index, value, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayField = (index, arrayName) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Company name must be at least 2 characters';
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

    if (formData.otpTemplate.expiration < 1 || formData.otpTemplate.expiration > 60) {
      newErrors.otpExpiration = 'OTP expiration must be between 1-60 minutes';
    }

    // Validate allowed domains
    formData.allowedDomains.forEach((domain, index) => {
      if (domain.trim() && !domain.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)) {
        newErrors[`allowedDomains_${index}`] = 'Invalid domain format';
      }
    });

    // Validate redirect URIs
    formData.redirectUris.forEach((uri, index) => {
      if (uri.trim()) {
        try {
          new URL(uri);
        } catch {
          newErrors[`redirectUris_${index}`] = 'Invalid URL format';
        }
      }
    });

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
      // Filter out empty values from arrays
      const cleanedData = {
        ...formData,
        allowedDomains: formData.allowedDomains.filter(domain => domain.trim()),
        redirectUris: formData.redirectUris.filter(uri => uri.trim())
      };

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        //   'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT token
        },
        body: JSON.stringify(cleanedData)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setGeneratedClient(data.data.client);
        
        showAlert('success', 'Client Created Successfully!', 
          `Your client has been registered successfully. API Key: ${data.data.client.apiKey} (Please save this securely)`);

        // Reset form
        setFormData({
          name: '',
          website: '',
          description: '',
          allowedDomains: [''],
          redirectUris: [''],
          otpTemplate: {
            subject: 'Your Verification Code',
            message: 'Your OTP is: {otp}. Valid for {expiration} minutes.',
            expiration: 10
          }
        });
        
      } else {
        throw new Error(data.message || 'Failed to create client');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      showAlert('error', 'Registration Failed', error.message || 'Something went wrong. Please try again.');
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
                  Company Name *
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your company name"
                />
                {errors.name && (
                  <span className="error-message">
                    <AlertCircle className="error-icon" />
                    {errors.name}
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

            {/* Security Configuration */}
            <div className="form-section">
              <h3 className="section-title">
                <Shield className="section-icon" />
                Security Configuration
              </h3>

              <div className="form-group">
                <label className="form-label">Allowed Domains</label>
                <p className="form-help">Domains that can use your API key</p>
                {formData.allowedDomains.map((domain, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => handleArrayInputChange(index, e.target.value, 'allowedDomains')}
                      className={`form-input ${errors[`allowedDomains_${index}`] ? 'error' : ''}`}
                      placeholder="example.com"
                    />
                    {formData.allowedDomains.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'allowedDomains')}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    )}
                    {errors[`allowedDomains_${index}`] && (
                      <span className="error-message">
                        <AlertCircle className="error-icon" />
                        {errors[`allowedDomains_${index}`]}
                      </span>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('allowedDomains')}
                  className="add-btn"
                >
                  + Add Domain
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Redirect URIs</label>
                <p className="form-help">Valid redirect URLs for OAuth flows</p>
                {formData.redirectUris.map((uri, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="url"
                      value={uri}
                      onChange={(e) => handleArrayInputChange(index, e.target.value, 'redirectUris')}
                      className={`form-input ${errors[`redirectUris_${index}`] ? 'error' : ''}`}
                      placeholder="https://yourapp.com/callback"
                    />
                    {formData.redirectUris.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(index, 'redirectUris')}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    )}
                    {errors[`redirectUris_${index}`] && (
                      <span className="error-message">
                        <AlertCircle className="error-icon" />
                        {errors[`redirectUris_${index}`]}
                      </span>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('redirectUris')}
                  className="add-btn"
                >
                  + Add URI
                </button>
              </div>
            </div>

            {/* OTP Template Configuration */}
            <div className="form-section">
              <h3 className="section-title">
                <Mail className="section-icon" />
                OTP Template Configuration
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="otp-subject-input">
                    Email Subject
                  </label>
                  <input
                    id="otp-subject-input"
                    type="text"
                    name="otpTemplate.subject"
                    value={formData.otpTemplate.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Your Verification Code"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="otp-expiration-input">
                    Expiration (minutes) *
                  </label>
                  <div className="input-with-icon">
                    <Clock className="input-icon" />
                    <input
                      id="otp-expiration-input"
                      type="number"
                      name="otpTemplate.expiration"
                      value={formData.otpTemplate.expiration}
                      onChange={handleInputChange}
                      className={`form-input with-icon ${errors.otpExpiration ? 'error' : ''}`}
                      min="1"
                      max="60"
                    />
                  </div>
                  {errors.otpExpiration && (
                    <span className="error-message">
                      <AlertCircle className="error-icon" />
                      {errors.otpExpiration}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="otp-message-input">
                  Email Message Template
                </label>
                <textarea
                  id="otp-message-input"
                  name="otpTemplate.message"
                  value={formData.otpTemplate.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Your OTP is: {otp}. Valid for {expiration} minutes."
                  rows="3"
                />
                <p className="form-help">
                  Use {'{otp}'} for the code and {'{expiration}'} for expiration time
                </p>
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
                    Register Client
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