import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Swal from 'sweetalert2';

const ClientProfile = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState({});

    useEffect(() => {
        fetchClientProfile();
    }, []);

    const fetchClientProfile = async () => {
        try {
            const clientString = localStorage.getItem('client');
            if (!clientString) {
                Swal.fire({
                    icon: 'error',
                    title: 'Authentication Required',
                    text: 'Please login to access this page'
                });
                return;
            }

            // Parse the client object
            const clientData = JSON.parse(clientString);
            const validToken = clientData.token;



            console.log(validToken)
            if (!validToken) {
                Swal.fire({
                    icon: 'error',
                    title: 'Authentication Required',
                    text: 'Please login to access this page'
                });
                return;
            }

            const response = await fetch('/api/clients/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${validToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.status === 'success') {
                setClientData(data.data.client);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load profile data'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPlanBadgeClass = (plan) => {
        const planClasses = {
            free: 'plan-badge-free',
            starter: 'plan-badge-starter',
            professional: 'plan-badge-professional',
            enterprise: 'plan-badge-enterprise'
        };
        return planClasses[plan] || 'plan-badge-free';
    };

    const handleEdit = async (field, value) => {
        try {
            const tokens = JSON.parse(localStorage.getItem('clientTokens') || '[]');
            const validToken = tokens.find(token => new Date(token.expiration) > new Date());
            const response = await fetch('/api/clients/profile/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${validToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [field]: value })
            });

            const data = await response.json();

            if (data.status === 'success') {
                setClientData(prev => ({ ...prev, [field]: value }));
                setIsEditing(prev => ({ ...prev, [field]: false }));
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Profile updated successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message || 'Failed to update profile'
            });
        }
    };

    const generateNewApiKey = async () => {
        const result = await Swal.fire({
            title: 'Generate New API Key',
            input: 'text',
            inputLabel: 'Description (optional)',
            inputPlaceholder: 'Enter description for this API key',
            showCancelButton: true,
            confirmButtonText: 'Generate',
            inputValidator: (value) => {
                if (value && value.length > 100) {
                    return 'Description must be less than 100 characters';
                }
            }
        });

        if (result.isConfirmed) {
            try {
                const tokens = JSON.parse(localStorage.getItem('clientTokens') || '[]');
                const validToken = tokens.find(token => new Date(token.expiration) > new Date());
                const response = await fetch('/api/clients/api-keys/generate', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${validToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ description: result.value || 'Generated from profile' })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    fetchClientProfile(); // Refresh data
                    Swal.fire({
                        icon: 'success',
                        title: 'API Key Generated!',
                        html: `<div style="text-align: left;">
              <p><strong>API Key:</strong></p>
              <code style="background: #f0f0f0; padding: 8px; border-radius: 4px; display: block; margin: 8px 0;">${data.data.apiKey}</code>
              <p><strong>Secret Key:</strong></p>
              <code style="background: #f0f0f0; padding: 8px; border-radius: 4px; display: block; margin: 8px 0;">${data.data.secretKey}</code>
              <p style="color: red; font-size: 12px; margin-top: 10px;">⚠️ Save these keys securely. The secret key won't be shown again!</p>
            </div>`,
                        width: '600px'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Generation Failed',
                    text: 'Failed to generate API key'
                });
            }
        }
    };

    const toggleApiKey = async (keyId, currentStatus) => {
        try {
            const token = localStorage.getItem('clientToken');
            const response = await fetch(`/api/clients/api-keys/${keyId}/toggle`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.status === 'success') {
                fetchClientProfile(); // Refresh data
                Swal.fire({
                    icon: 'success',
                    title: currentStatus ? 'API Key Deactivated' : 'API Key Activated',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update API key status'
            });
        }
    };

    if (loading) {
        return (
            <div className={`client-profile-loading-container ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="client-profile-loading-spinner"></div>
                <p className="client-profile-loading-text">Loading your profile...</p>
            </div>
        );
    }

    if (!clientData) {
        return (
            <div className={`client-profile-error-container ${isDarkMode ? 'dark' : 'light'}`}>
                <h2 className="client-profile-error-title">Profile Not Found</h2>
                <p className="client-profile-error-text">Unable to load your profile data.</p>
            </div>
        );
    }

    return (
        <div className={`client-profile-main-container ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="client-profile-header-section">
                <div className="client-profile-header-content">
                    <div className="client-profile-avatar-section">
                        {clientData.branding?.logo?.data ? (
                            <img
                                src={clientData.branding.logo.data}
                                alt="Company Logo"
                                className="client-profile-company-logo"
                            />
                        ) : (
                            <div className="client-profile-default-avatar">
                                {clientData.name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                        )}
                    </div>
                    <div className="client-profile-header-info">
                        <h1 className="client-profile-company-name">
                            {clientData.branding?.companyName || clientData.name || 'Company Name Not Set'}
                        </h1>
                        <p className="client-profile-website-url">
                            {clientData.website || 'Website not provided'}
                        </p>
                        <div className="client-profile-status-badges">
                            <span className={`client-profile-plan-badge ${getPlanBadgeClass(clientData.subscription?.plan)}`}>
                                {clientData.subscription?.plan?.toUpperCase() || 'FREE'}
                            </span>
                            <span className={`client-profile-status-badge ${clientData.isActive ? 'active' : 'inactive'}`}>
                                {clientData.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="client-profile-tabs-container">
                <nav className="client-profile-tabs-navigation">
                    {[
                        { id: 'profile', label: 'Profile', icon: '👤' },
                        { id: 'branding', label: 'Branding', icon: '🎨' },
                        { id: 'api', label: 'API Keys', icon: '🔑' },
                        { id: 'subscription', label: 'Subscription', icon: '💳' },
                        { id: 'security', label: 'Security', icon: '🔒' },
                        { id: 'webhooks', label: 'Webhooks', icon: '🔗' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`client-profile-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            <span className="client-profile-tab-icon">{tab.icon}</span>
                            <span className="client-profile-tab-label">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="client-profile-content-container">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="client-profile-tab-content">
                        <div className="client-profile-section-card">
                            <h3 className="client-profile-section-title">Basic Information</h3>
                            <div className="client-profile-info-grid">
                                <div className="client-profile-info-item">
                                    <label className="client-profile-info-label">Full Name</label>
                                    <div className="client-profile-info-value">{clientData.name || 'Not entered yet'}</div>
                                </div>
                                <div className="client-profile-info-item">
                                    <label className="client-profile-info-label">Email Address</label>
                                    <div className="client-profile-info-value">{clientData.email || 'Not entered yet'}</div>
                                </div>
                                <div className="client-profile-info-item">
                                    <label className="client-profile-info-label">Website</label>
                                    <div className="client-profile-info-value">{clientData.website || 'Not entered yet'}</div>
                                </div>
                                <div className="client-profile-info-item">
                                    <label className="client-profile-info-label">Registration Method</label>
                                    <div className="client-profile-info-value">
                                        {clientData.registerUsing ? clientData.registerUsing.replace('-', ' ').toUpperCase() : 'Standard Registration'}
                                    </div>
                                </div>
                                <div className="client-profile-info-item">
                                    <label className="client-profile-info-label">Account Created</label>
                                    <div className="client-profile-info-value">{formatDate(clientData.createdAt)}</div>
                                </div>
                                <div className="client-profile-info-item">
                                    <label className="client-profile-info-label">Last Login</label>
                                    <div className="client-profile-info-value">{formatDate(clientData.lastLogin)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="client-profile-section-card">
                            <h3 className="client-profile-section-title">Account Status</h3>
                            <div className="client-profile-status-grid">
                                <div className="client-profile-status-item">
                                    <span className="client-profile-status-label">Email Verified</span>
                                    <span className={`client-profile-status-indicator ${clientData.emailVerified ? 'verified' : 'unverified'}`}>
                                        {clientData.emailVerified ? 'Verified ✓' : 'Not Verified ✗'}
                                    </span>
                                </div>
                                <div className="client-profile-status-item">
                                    <span className="client-profile-status-label">Account Status</span>
                                    <span className={`client-profile-status-indicator ${clientData.isActive ? 'active' : 'inactive'}`}>
                                        {clientData.isActive ? 'Active ✓' : 'Inactive ✗'}
                                    </span>
                                </div>
                                <div className="client-profile-status-item">
                                    <span className="client-profile-status-label">Total API Requests</span>
                                    <span className="client-profile-status-value">{clientData.totalRequests?.toLocaleString() || '0'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Branding Tab */}
                {activeTab === 'branding' && (
                    <div className="client-profile-tab-content">
                        <div className="client-profile-section-card">
                            <h3 className="client-profile-section-title">Brand Settings</h3>
                            <div className="client-profile-branding-grid">
                                <div className="client-profile-branding-item">
                                    <label className="client-profile-info-label">Company Name</label>
                                    <div className="client-profile-info-value">
                                        {clientData.branding?.companyName || 'Not entered yet'}
                                    </div>
                                </div>
                                <div className="client-profile-branding-item">
                                    <label className="client-profile-info-label">Primary Color</label>
                                    <div className="client-profile-color-display">
                                        <div
                                            className="client-profile-color-preview"
                                            style={{ backgroundColor: clientData.branding?.primaryColor || '#2563eb' }}
                                        ></div>
                                        <span className="client-profile-color-value">
                                            {clientData.branding?.primaryColor || '#2563eb'}
                                        </span>
                                    </div>
                                </div>
                                <div className="client-profile-branding-item">
                                    <label className="client-profile-info-label">Terms URL</label>
                                    <div className="client-profile-info-value">
                                        {clientData.branding?.termsUrl || 'Not entered yet'}
                                    </div>
                                </div>
                                <div className="client-profile-branding-item">
                                    <label className="client-profile-info-label">Privacy Policy URL</label>
                                    <div className="client-profile-info-value">
                                        {clientData.branding?.privacyPolicyUrl || 'Not entered yet'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* API Keys Tab */}
                {activeTab === 'api' && (
                    <div className="client-profile-tab-content">
                        <div className="client-profile-section-card">
                            <div className="client-profile-section-header">
                                <h3 className="client-profile-section-title">API Keys</h3>
                                <button
                                    className="client-profile-generate-key-btn"
                                    onClick={generateNewApiKey}
                                >
                                    + Generate New Key
                                </button>
                            </div>

                            {clientData.apiKeys && clientData.apiKeys.length > 0 ? (
                                <div className="client-profile-api-keys-list">
                                    {clientData.apiKeys.map((apiKey, index) => (
                                        <div key={index} className="client-profile-api-key-card">
                                            <div className="client-profile-api-key-header">
                                                <h4 className="client-profile-api-key-title">
                                                    {apiKey.description || `API Key ${index + 1}`}
                                                </h4>
                                                <span className={`client-profile-api-key-status ${apiKey.isActive ? 'active' : 'inactive'}`}>
                                                    {apiKey.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="client-profile-api-key-details">
                                                <div className="client-profile-api-key-field">
                                                    <label>API Key:</label>
                                                    <code className="client-profile-api-key-value">
                                                        {apiKey.apiKey?.substring(0, 20)}...
                                                    </code>
                                                </div>
                                                <div className="client-profile-api-key-meta">
                                                    <span>Created: {formatDate(apiKey.createdAt)}</span>
                                                    <span>Last Used: {formatDate(apiKey.lastUsed)}</span>
                                                    <span>Rate Limit: {apiKey.rateLimit || 60}/min</span>
                                                </div>
                                                <div className="client-profile-api-key-permissions">
                                                    <strong>Permissions:</strong>
                                                    {apiKey.permissions?.map(permission => (
                                                        <span key={permission} className="client-profile-permission-tag">
                                                            {permission}
                                                        </span>
                                                    )) || <span>No permissions set</span>}
                                                </div>
                                                <div className="client-profile-api-key-actions">
                                                    <button
                                                        className={`client-profile-toggle-key-btn ${apiKey.isActive ? 'deactivate' : 'activate'}`}
                                                        onClick={() => toggleApiKey(apiKey._id, apiKey.isActive)}
                                                    >
                                                        {apiKey.isActive ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="client-profile-no-api-keys">
                                    <p>No API keys generated yet. Click "Generate New Key" to create your first API key.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Subscription Tab */}
                {activeTab === 'subscription' && (
                    <div className="client-profile-tab-content">
                        <div className="client-profile-section-card">
                            <h3 className="client-profile-section-title">Subscription Details</h3>
                            <div className="client-profile-subscription-overview">
                                <div className="client-profile-subscription-plan">
                                    <h4 className="client-profile-plan-title">Current Plan</h4>
                                    <div className={`client-profile-plan-badge-large ${getPlanBadgeClass(clientData.subscription?.plan)}`}>
                                        {clientData.subscription?.plan?.toUpperCase() || 'FREE'}
                                    </div>
                                </div>
                                <div className="client-profile-subscription-limits">
                                    <div className="client-profile-limit-item">
                                        <span className="client-profile-limit-label">Users</span>
                                        <div className="client-profile-limit-bar">
                                            <div
                                                className="client-profile-limit-progress"
                                                style={{
                                                    width: `${(clientData.subscription?.currentUsers || 0) / (clientData.subscription?.maxUsers || 1) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="client-profile-limit-text">
                                            {clientData.subscription?.currentUsers || 0} / {clientData.subscription?.maxUsers || 100}
                                        </span>
                                    </div>
                                    <div className="client-profile-limit-item">
                                        <span className="client-profile-limit-label">Monthly Requests</span>
                                        <div className="client-profile-limit-bar">
                                            <div
                                                className="client-profile-limit-progress"
                                                style={{
                                                    width: `${(clientData.totalRequests || 0) / (clientData.subscription?.monthlyRequests || 1) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="client-profile-limit-text">
                                            {clientData.totalRequests?.toLocaleString() || 0} / {clientData.subscription?.monthlyRequests?.toLocaleString() || '10,000'}
                                        </span>
                                    </div>
                                </div>
                                {clientData.subscription?.expiresAt && (
                                    <div className="client-profile-subscription-expiry">
                                        <strong>Expires:</strong> {formatDate(clientData.subscription.expiresAt)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {clientData.subscription?.features && clientData.subscription.features.length > 0 && (
                            <div className="client-profile-section-card">
                                <h3 className="client-profile-section-title">Features Included</h3>
                                <div className="client-profile-features-grid">
                                    {clientData.subscription.features.map((feature, index) => (
                                        <div key={index} className="client-profile-feature-item">
                                            <span className="client-profile-feature-checkmark">✓</span>
                                            <span className="client-profile-feature-name">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="client-profile-tab-content">
                        <div className="client-profile-section-card">
                            <h3 className="client-profile-section-title">Security Settings</h3>
                            <div className="client-profile-security-grid">
                                <div className="client-profile-security-item">
                                    <label className="client-profile-info-label">Multi-Factor Authentication</label>
                                    <span className={`client-profile-status-indicator ${clientData.authConfig?.enableMFA ? 'enabled' : 'disabled'}`}>
                                        {clientData.authConfig?.enableMFA ? 'Enabled ✓' : 'Disabled ✗'}
                                    </span>
                                </div>
                                <div className="client-profile-security-item">
                                    <label className="client-profile-info-label">Email Verification Required</label>
                                    <span className={`client-profile-status-indicator ${clientData.authConfig?.requireEmailVerification ? 'enabled' : 'disabled'}`}>
                                        {clientData.authConfig?.requireEmailVerification ? 'Required ✓' : 'Not Required ✗'}
                                    </span>
                                </div>
                                <div className="client-profile-security-item">
                                    <label className="client-profile-info-label">Login Attempts</label>
                                    <span className="client-profile-status-value">{clientData.loginAttempts || 0}</span>
                                </div>
                                {clientData.lockUntil && (
                                    <div className="client-profile-security-item">
                                        <label className="client-profile-info-label">Account Lock Until</label>
                                        <span className="client-profile-status-value">{formatDate(clientData.lockUntil)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="client-profile-section-card">
                            <h3 className="client-profile-section-title">Password Policy</h3>
                            <div className="client-profile-password-policy">
                                <div className="client-profile-policy-item">
                                    <span className="client-profile-policy-label">Minimum Length:</span>
                                    <span className="client-profile-policy-value">{clientData.authConfig?.passwordPolicy?.minLength || 8} characters</span>
                                </div>
                                <div className="client-profile-policy-item">
                                    <span className="client-profile-policy-label">Require Numbers:</span>
                                    <span className={`client-profile-policy-status ${clientData.authConfig?.passwordPolicy?.requireNumbers ? 'enabled' : 'disabled'}`}>
                                        {clientData.authConfig?.passwordPolicy?.requireNumbers ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="client-profile-policy-item">
                                    <span className="client-profile-policy-label">Require Symbols:</span>
                                    <span className={`client-profile-policy-status ${clientData.authConfig?.passwordPolicy?.requireSymbols ? 'enabled' : 'disabled'}`}>
                                        {clientData.authConfig?.passwordPolicy?.requireSymbols ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="client-profile-policy-item">
                                    <span className="client-profile-policy-label">Require Uppercase:</span>
                                    <span className={`client-profile-policy-status ${clientData.authConfig?.passwordPolicy?.requireUppercase ? 'enabled' : 'disabled'}`}>
                                        {clientData.authConfig?.passwordPolicy?.requireUppercase ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Webhooks Tab */}
                {activeTab === 'webhooks' && (
                    <div className="client-profile-tab-content">
                        <div className="client-profile-section-card">
                            <h3 className="client-profile-section-title">Webhook Configuration</h3>
                            <div className="client-profile-webhook-config">
                                <div className="client-profile-webhook-item">
                                    <label className="client-profile-info-label">Webhook URL</label>
                                    <div className="client-profile-info-value">
                                        {clientData.webhooks?.url || 'Not configured yet'}
                                    </div>
                                </div>
                                <div className="client-profile-webhook-item">
                                    <label className="client-profile-info-label">Status</label>
                                    <span className={`client-profile-status-indicator ${clientData.webhooks?.isActive ? 'active' : 'inactive'}`}>
                                        {clientData.webhooks?.isActive ? 'Active ✓' : 'Inactive ✗'}
                                    </span>
                                </div>
                                <div className="client-profile-webhook-item">
                                    <label className="client-profile-info-label">Last Webhook Sent</label>
                                    <div className="client-profile-info-value">
                                        {formatDate(clientData.lastWebhookSent)}
                                    </div>
                                </div>
                            </div>

                            {clientData.webhooks?.events && clientData.webhooks.events.length > 0 && (
                                <div className="client-profile-webhook-events">
                                    <h4 className="client-profile-webhook-events-title">Subscribed Events</h4>
                                    <div className="client-profile-webhook-events-grid">
                                        {clientData.webhooks.events.map((event, index) => (
                                            <span key={index} className="client-profile-webhook-event-tag">
                                                {event.replace(':', ' ').replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientProfile;