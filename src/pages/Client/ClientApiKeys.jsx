import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, Edit2, Trash2, Copy, RefreshCw, Globe, Shield, Calendar, Activity } from 'lucide-react';
import Swal from 'sweetalert2';

const ApiKeysPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showSecrets, setShowSecrets] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    allowedDomains: [''],
    redirectUris: [''],
    subscription: {
      plan: 'free',
      requestsLimit: 1000
    },
    otpTemplate: {
      subject: 'Your Verification Code',
      expiration: 10
    }
  });

  // API Base URL
  const API_BASE = '/api/clients';

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = darkMode ? 'api-keys-dark-theme' : 'api-keys-light-theme';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Fetch clients
  const fetchClients = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}?page=${page}&limit=10&search=${search}`, {
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClients(data.data.clients);
        setTotalPages(data.data.pagination.pages);
        setCurrentPage(page);
      } else {
        throw new Error('Failed to fetch clients');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch API keys',
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingClient ? 'PUT' : 'POST';
      const url = editingClient ? `${API_BASE}/${editingClient._id}` : API_BASE;
      
      const response = await fetch(url, {
        method,
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Client ${editingClient ? 'updated' : 'created'} successfully`,
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        });
        
        setShowModal(false);
        setEditingClient(null);
        resetForm();
        fetchClients(currentPage, searchTerm);
      } else {
        throw new Error(`Failed to ${editingClient ? 'update' : 'create'} client`);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000'
      });
    }
    setLoading(false);
  };

  // Delete client
  const handleDelete = async (client) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete API key for ${client.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE}/${client._id}`, {
          method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Client has been deleted.',
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          });
          fetchClients(currentPage, searchTerm);
        } else {
          throw new Error('Failed to delete client');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete client',
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        });
      }
    }
  };

  // Toggle client status
  const toggleStatus = async (client) => {
    try {
      const response = await fetch(`${API_BASE}/${client._id}/status`, {
        method: 'PATCH',
        // headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`
        // }
      });

      if (response.ok) {
        fetchClients(currentPage, searchTerm);
      } else {
        throw new Error('Failed to toggle status');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to toggle client status',
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000'
      });
    }
  };

  // Regenerate API key
  const regenerateApiKey = async (client) => {
    const result = await Swal.fire({
      title: 'Regenerate API Key?',
      text: 'This will invalidate the current API key',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, regenerate',
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE}/${client._id}/regenerate-api-key`, {
          method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        });

        if (response.ok) {
          const data = await response.json();
          Swal.fire({
            icon: 'success',
            title: 'API Key Regenerated',
            text: `New API Key: ${data.data.apiKey}`,
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000'
          });
          fetchClients(currentPage, searchTerm);
        } else {
          throw new Error('Failed to regenerate API key');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to regenerate API key',
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000'
        });
      }
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
      text: 'API key copied to clipboard',
      timer: 1500,
      showConfirmButton: false,
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000'
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      website: '',
      description: '',
      allowedDomains: [''],
      redirectUris: [''],
      subscription: {
        plan: 'free',
        requestsLimit: 1000
      },
      otpTemplate: {
        subject: 'Your Verification Code',
        expiration: 10
      }
    });
  };

  // Edit client
  const editClient = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      website: client.website,
      description: client.description || '',
      allowedDomains: client.allowedDomains.length ? client.allowedDomains : [''],
      redirectUris: client.redirectUris.length ? client.redirectUris : [''],
      subscription: client.subscription,
      otpTemplate: client.otpTemplate
    });
    setShowModal(true);
  };

  // Toggle secret visibility
  const toggleSecret = (clientId) => {
    setShowSecrets(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  // Add/remove domain/URI fields
  const updateArrayField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  return (
    <div className="api-keys-main-container">
      {/* Header */}
      <div className="api-keys-header">
        <div className="api-keys-header-content">
          <div className="api-keys-title-section">
            <h1 className="api-keys-main-title">API Keys Management</h1>
            <p className="api-keys-subtitle">Manage your client API keys and configurations</p>
          </div>
          
          <div className="api-keys-header-actions">
            <button
              className="api-keys-theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <button
              className="api-keys-add-btn"
              onClick={() => {
                resetForm();
                setEditingClient(null);
                setShowModal(true);
              }}
            >
              <Plus size={20} />
              Add API Key
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="api-keys-search-container">
          <input
            type="text"
            placeholder="Search by name, website, or API key..."
            className="api-keys-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="api-keys-content">
        {loading ? (
          <div className="api-keys-loading">
            <div className="api-keys-spinner"></div>
          </div>
        ) : (
          <div className="api-keys-grid">
            {clients.map((client) => (
              <div key={client._id} className="api-keys-card">
                <div className="api-keys-card-header">
                  <div className="api-keys-card-title">
                    <h3 className="api-keys-client-name">{client.name}</h3>
                    <div className="api-keys-status-badges">
                      <span className={`api-keys-status-badge ${client.isActive ? 'active' : 'inactive'}`}>
                        {client.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`api-keys-plan-badge ${client.subscription?.plan || 'free'}`}>
                        {(client.subscription?.plan || 'free').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="api-keys-card-actions">
                    <button
                      className="api-keys-action-btn edit"
                      onClick={() => editClient(client)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="api-keys-action-btn regenerate"
                      onClick={() => regenerateApiKey(client)}
                      title="Regenerate API Key"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      className="api-keys-action-btn delete"
                      onClick={() => handleDelete(client)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="api-keys-card-content">
                  <div className="api-keys-info-row">
                    <Globe size={16} />
                    <span className="api-keys-website">{client.website}</span>
                  </div>
                  
                  {client.description && (
                    <p className="api-keys-description">{client.description}</p>
                  )}

                  <div className="api-keys-key-section">
                    <label className="api-keys-key-label">API Key:</label>
                    <div className="api-keys-key-container">
                      <input
                        type={showSecrets[client._id] ? 'text' : 'password'}
                        value={client.apiKey}
                        readOnly
                        className="api-keys-key-input"
                      />
                      <button
                        className="api-keys-toggle-btn"
                        onClick={() => toggleSecret(client._id)}
                      >
                        {showSecrets[client._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        className="api-keys-copy-btn"
                        onClick={() => copyToClipboard(client.apiKey)}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="api-keys-stats">
                    <div className="api-keys-stat">
                      <Activity size={14} />
                      <span>{client.subscription?.currentRequests || 0} / {client.subscription?.requestsLimit || 1000} requests</span>
                    </div>
                    <div className="api-keys-stat">
                      <Calendar size={14} />
                      <span>Created {new Date(client.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="api-keys-toggle-container">
                    <label className="api-keys-toggle-label">
                      <input
                        type="checkbox"
                        checked={client.isActive}
                        onChange={() => toggleStatus(client)}
                        className="api-keys-toggle-input"
                      />
                      <span className="api-keys-toggle-slider"></span>
                      <span className="api-keys-toggle-text">
                        {client.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="api-keys-pagination">
            <button
              className="api-keys-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            
            <div className="api-keys-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`api-keys-page-number ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              className="api-keys-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="api-keys-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="api-keys-modal" onClick={e => e.stopPropagation()}>
            <div className="api-keys-modal-header">
              <h2 className="api-keys-modal-title">
                {editingClient ? 'Edit API Key' : 'Add New API Key'}
              </h2>
              <button
                className="api-keys-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="api-keys-modal-form">
              <div className="api-keys-form-group">
                <label className="api-keys-form-label">Client Name *</label>
                <input
                  type="text"
                  required
                  className="api-keys-form-input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="api-keys-form-group">
                <label className="api-keys-form-label">Website URL *</label>
                <input
                  type="url"
                  required
                  className="api-keys-form-input"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <div className="api-keys-form-group">
                <label className="api-keys-form-label">Description</label>
                <textarea
                  className="api-keys-form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="api-keys-form-group">
                <label className="api-keys-form-label">Subscription Plan</label>
                <select
                  className="api-keys-form-select"
                  value={formData.subscription.plan}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscription: { ...prev.subscription, plan: e.target.value }
                  }))}
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="api-keys-form-group">
                <label className="api-keys-form-label">Request Limit</label>
                <input
                  type="number"
                  className="api-keys-form-input"
                  value={formData.subscription.requestsLimit}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    subscription: { ...prev.subscription, requestsLimit: parseInt(e.target.value) }
                  }))}
                />
              </div>

              <div className="api-keys-form-group">
                <label className="api-keys-form-label">Allowed Domains</label>
                {formData.allowedDomains.map((domain, index) => (
                  <div key={index} className="api-keys-array-input">
                    <input
                      type="text"
                      className="api-keys-form-input"
                      value={domain}
                      onChange={(e) => updateArrayField('allowedDomains', index, e.target.value)}
                      placeholder="example.com"
                    />
                    {formData.allowedDomains.length > 1 && (
                      <button
                        type="button"
                        className="api-keys-remove-btn"
                        onClick={() => removeArrayField('allowedDomains', index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="api-keys-add-field-btn"
                  onClick={() => addArrayField('allowedDomains')}
                >
                  Add Domain
                </button>
              </div>

              <div className="api-keys-form-group">
                <label className="api-keys-form-label">OTP Expiration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="api-keys-form-input"
                  value={formData.otpTemplate.expiration}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    otpTemplate: { ...prev.otpTemplate, expiration: parseInt(e.target.value) }
                  }))}
                />
              </div>

              <div className="api-keys-form-actions">
                <button
                  type="button"
                  className="api-keys-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="api-keys-submit-btn"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Saving...' : editingClient ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeysPage;