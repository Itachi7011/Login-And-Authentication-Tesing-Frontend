import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Swal from 'sweetalert2';
import { 
  User, 
    Circle,
  Asterisk,
    HelpCircle,
  Mail, 
  Calendar, 
  Clock, 
  Heart, 
  History, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  Star,
  Eye,
  Settings,
  Trophy,
  Activity
} from 'lucide-react';

const UserProfile = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    avatar: ''
  });

  // Fetch user data
  const UserDetails = async () => {
    try {
      const res = await fetch("/api/userProfile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Error during retrieve data - ${res.statusText}`);
      }

      const data = await res.json();
      setUser(data);
      setEditForm({
        username: data.username || '',
        email: data.email || '',
        avatar: data.avatar || ''
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load user profile',
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000'
      });
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async () => {
    try {
      const res = await fetch("/api/updateProfile", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editForm)
      });

      const data = await res.json();
      
      if (res.ok) {
        setUser({ ...user, ...editForm });
        setIsEditing(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully',
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000'
        });
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile',
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000'
      });
    }
  };

  // Add to favorites


  // Remove from favorites
  const removeFromFavorites = async (animeId) => {
    try {
      const res = await fetch("/api/removeFavorite", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ animeId })
      });

      if (res.ok) {
        UserDetails(); // Refresh user data
        Swal.fire({
          icon: 'success',
          title: 'Removed from Favorites',
          background: isDarkMode ? '#1a1a1a' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000'
        });
      }
    } catch (err) {
      console.error("Error removing from favorites:", err);
    }
  };

  useEffect(() => {
    UserDetails();
  }, []);

  const renderGenderIcon = (gender) => {
  switch (gender) {
    case 'male':
      return <User className="icon"size={35}  />;
    case 'female':
      return <Circle className="icon" size={35} />;
    case 'other':
      return <Asterisk className="icon" size={35} />;
    default:
      return <HelpCircle className="icon" size={35} />;
  }
};


  const formatDate = (date) => {
    if (!date) return 'Not available';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDate1 = (date) => {
  if (!date) return 'Not available';

  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  return new Date(date).toLocaleString('en-US', options);
};


  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ff6b6b';
      case 'moderator': return '#4ecdc4';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className={`otaku-wave-profile-loading ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="otaku-wave-profile-spinner"></div>
        <p className="otaku-wave-profile-loading-text">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={`otaku-wave-profile-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Profile Header */}
      <div className="otaku-wave-profile-header">
        <div className="otaku-wave-profile-hero-bg"></div>
        <div className="otaku-wave-profile-hero-content">
          <div className="otaku-wave-profile-avatar-section">
            <div className="otaku-wave-profile-avatar-wrapper">
              <img 
                src={user.avatar || '/default-avatar.jpg'} 
                alt="Profile Avatar"
                className="otaku-wave-profile-avatar-img"
              />
              <div className="otaku-wave-profile-avatar-glow"></div>
            </div>
            <div className="otaku-wave-profile-user-info">
<h1 className="otaku-wave-profile-username">
  {renderGenderIcon(user.gender)} {user.username || 'Anonymous Otaku'}
</h1>              <div className="otaku-wave-profile-role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                <Shield size={14} />
                {user.role || 'user'}
              </div>
              <p className="otaku-wave-profile-join-date">
                <Calendar size={16} />
                Member since {formatDate(user.joinDate)}
              </p>
            </div>
          </div>
          
          <div className="otaku-wave-profile-stats-grid">
            <div className="otaku-wave-profile-stat-card">
              <Heart className="otaku-wave-profile-stat-icon" />
              <div className="otaku-wave-profile-stat-info">
                <span className="otaku-wave-profile-stat-number">{user.favorites?.length || 0}</span>
                <span className="otaku-wave-profile-stat-label">Favorites</span>
              </div>
            </div>
            <div className="otaku-wave-profile-stat-card">
              <History className="otaku-wave-profile-stat-icon" />
              <div className="otaku-wave-profile-stat-info">
                <span className="otaku-wave-profile-stat-number">{user.watchHistory?.length || 0}</span>
                <span className="otaku-wave-profile-stat-label">Watched</span>
              </div>
            </div>
            <div className="otaku-wave-profile-stat-card">
              <Trophy className="otaku-wave-profile-stat-icon" />
              <div className="otaku-wave-profile-stat-info">
                <span className="otaku-wave-profile-stat-number">{user.isVerified ? 'Verified' : 'Pending'}</span>
                <span className="otaku-wave-profile-stat-label">Status</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="otaku-wave-profile-nav-container">
        <nav className="otaku-wave-profile-nav-tabs">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'history', label: 'Watch History', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              className={`otaku-wave-profile-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span className="otaku-wave-profile-nav-tab-text">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="otaku-wave-profile-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="otaku-wave-profile-tab-content">
            <div className="otaku-wave-profile-overview-grid">
              <div className="otaku-wave-profile-info-card">
                <h3 className="otaku-wave-profile-card-title">
                  <User size={20} />
                  Account Information
                </h3>
                <div className="otaku-wave-profile-info-list">
                  <div className="otaku-wave-profile-info-item">
                    <Mail size={16} />
                    <span className="otaku-wave-profile-info-label">Email:</span>
                    <span className="otaku-wave-profile-info-value">{user.email || 'Not provided'}</span>
                  </div>
                  <div className="otaku-wave-profile-info-item">
                    <Clock size={16} />
                    <span className="otaku-wave-profile-info-label">Last Login:</span>
                    <span className="otaku-wave-profile-info-value">{formatDate1(user.lastLogin)}</span>
                  </div>
                </div>
              </div>

              <div className="otaku-wave-profile-activity-card">
                <h3 className="otaku-wave-profile-card-title">
                  <Activity size={20} />
                  Recent Activity
                </h3>
                <div className="otaku-wave-profile-activity-list">
                  {user.watchHistory && user.watchHistory.length > 0 ? (
                    user.watchHistory.slice(0, 3).map((item, index) => (
                      <div key={index} className="otaku-wave-profile-activity-item">
                        <Eye size={16} />
                        <div className="otaku-wave-profile-activity-content">
                          <span className="otaku-wave-profile-activity-text">
                            Watched Episode {item.episode} of Season {item.season}
                          </span>
                          <span className="otaku-wave-profile-activity-time">
                            {formatDate(item.watchedAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="otaku-wave-profile-empty-state">No recent activity yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="otaku-wave-profile-tab-content">
            <div className="otaku-wave-profile-favorites-header">
              <h2 className="otaku-wave-profile-section-title">
                <Heart size={24} />
                My Favorite Anime
              </h2>
            </div>
            <div className="otaku-wave-profile-favorites-grid">
              {user.favorites && user.favorites.length > 0 ? (
                user.favorites.map((anime, index) => (
                  <div key={index} className="otaku-wave-profile-favorite-card">
                    <div className="otaku-wave-profile-favorite-image">
                      <img src={anime.image || '/default-anime.jpg'} alt={anime.title} />
                      <div className="otaku-wave-profile-favorite-overlay">
                        <button 
                          className="otaku-wave-profile-remove-favorite-btn"
                          onClick={() => removeFromFavorites(anime._id)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="otaku-wave-profile-favorite-info">
                      <h4 className="otaku-wave-profile-favorite-title">{anime.title || 'Unknown Title'}</h4>
                      <div className="otaku-wave-profile-favorite-rating">
                        <Star size={14} />
                        <span>{anime.rating || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="otaku-wave-profile-empty-favorites">
                  <Heart size={48} />
                  <h3>No favorites yet</h3>
                  <p>Start adding anime to your favorites to see them here!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Watch History Tab */}
        {activeTab === 'history' && (
          <div className="otaku-wave-profile-tab-content">
            <div className="otaku-wave-profile-history-header">
              <h2 className="otaku-wave-profile-section-title">
                <History size={24} />
                Watch History
              </h2>
            </div>
            <div className="otaku-wave-profile-history-list">
              {user.watchHistory && user.watchHistory.length > 0 ? (
                user.watchHistory.map((item, index) => (
                  <div key={index} className="otaku-wave-profile-history-item">
                    <div className="otaku-wave-profile-history-icon">
                      <Eye size={20} />
                    </div>
                    <div className="otaku-wave-profile-history-content">
                      <h4 className="otaku-wave-profile-history-title">
                        {item.anime?.title || 'Unknown Anime'}
                      </h4>
                      <p className="otaku-wave-profile-history-details">
                        Season {item.season || 'N/A'}, Episode {item.episode || 'N/A'}
                      </p>
                      <span className="otaku-wave-profile-history-date">
                        {formatDate(item.watchedAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="otaku-wave-profile-empty-history">
                  <History size={48} />
                  <h3>No watch history yet</h3>
                  <p>Your viewing history will appear here as you watch anime!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="otaku-wave-profile-tab-content">
            <div className="otaku-wave-profile-settings-header">
              <h2 className="otaku-wave-profile-section-title">
                <Settings size={24} />
                Profile Settings
              </h2>
              <button 
                className="otaku-wave-profile-edit-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X size={18} /> : <Edit3 size={18} />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="otaku-wave-profile-settings-form">
              <div className="otaku-wave-profile-form-group">
                <label className="otaku-wave-profile-form-label" htmlFor="otaku-wave-username-input">
                  Username
                </label>
                <input
                  id="otaku-wave-username-input"
                  type="text"
                  className="otaku-wave-profile-form-input"
                  value={isEditing ? editForm.username : user.username || ''}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter your username"
                />
              </div>

              <div className="otaku-wave-profile-form-group">
                <label className="otaku-wave-profile-form-label" htmlFor="otaku-wave-email-input">
                  Email
                </label>
                <input
                  id="otaku-wave-email-input"
                  type="email"
                  className="otaku-wave-profile-form-input"
                  value={isEditing ? editForm.email : user.email || ''}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
              </div>

              <div className="otaku-wave-profile-form-group">
                <label className="otaku-wave-profile-form-label" htmlFor="otaku-wave-avatar-input">
                  Avatar URL
                </label>
                <input
                  id="otaku-wave-avatar-input"
                  type="url"
                  className="otaku-wave-profile-form-input"
                  value={isEditing ? editForm.avatar : user.avatar || ''}
                  onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter avatar image URL"
                />
              </div>

              {isEditing && (
                <button 
                  className="otaku-wave-profile-save-btn"
                  onClick={updateProfile}
                >
                  <Save size={18} />
                  Save Changes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;