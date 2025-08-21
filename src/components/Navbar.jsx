import React, { useState, useContext, useRef, useEffect } from 'react';
import { Search, Menu, X, ChevronDown, Sun, Moon , LogIn, UserPlus, LogOut, User} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from "../context/UserContext";

// Mock ThemeContext - replace with your actual context


const OtakuWaveNavbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [owNavMobileOpen, setOwNavMobileOpen] = useState(false);
  const [owNavDropdownOpen, setOwNavDropdownOpen] = useState(null);
  const [owNavSearchValue, setOwNavSearchValue] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOwNavDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/logout', {
      method: 'GET',
      credentials: 'include' // Important for cookies to be sent
    });
    
    if (response.ok) {
      // Only dispatch and redirect if the logout was successful
      dispatch({ type: "LOGOUT" });
      window.location.href = "/Login";
    } else {
      console.error('Logout failed:', await response.text());
    }
  } catch (err) {
    console.error('Error during logout:', err);
  }
};



  const navItems = [
    {
      id: 'ow-nav-home',
      label: 'Home',
      href: '/',
    },
    {
      id: 'ow-nav-anime',
      label: 'Anime',
      href: '/anime',
      dropdown: [
        { label: 'Popular Anime', href: '/anime/popular' },
        { label: 'Latest Episodes', href: '/anime/latest' },
        { label: 'Top Rated', href: '/anime/top-rated' },
        { label: 'Completed Series', href: '/anime/completed' },
        { label: 'Ongoing Series', href: '/anime/ongoing' }
      ]
    },
    {
      id: 'ow-nav-genres',
      label: 'Genres',
      href: '/genres',
      dropdown: [
        { label: 'Action', href: '/genres/action' },
        { label: 'Romance', href: '/genres/romance' },
        { label: 'Comedy', href: '/genres/comedy' },
        { label: 'Drama', href: '/genres/drama' },
        { label: 'Fantasy', href: '/genres/fantasy' },
        { label: 'Sci-Fi', href: '/genres/sci-fi' }
      ]
    },
    {
      id: 'ow-nav-movies',
      label: 'Movies',
      href: '/movies',
    },
    {
      id: 'ow-nav-community',
      label: 'Community',
      href: '/community',
    }
  ];

  const authOptions = {
    loggedIn: [
      {
        id: 'ow-nav-user',
        label: 'My Account',
        icon: <User size={18} />,
        href: '/account'
      },
      {
        id: 'ow-nav-logout',
        label: 'Logout',
        icon: <LogOut size={18} />,
       onClick: handleLogout
      }
    ],
    loggedOut: [
      {
        id: 'ow-nav-login',
        label: 'Login',
        icon: <LogIn size={18} />,
        href: '/Login'
      },
      {
        id: 'ow-nav-signup',
        label: 'Sign Up',
        icon: <UserPlus size={18} />,
        href: '/NewRegistration'
      }
    ]
  };


  const handleDropdownToggle = (itemId) => {
    setOwNavDropdownOpen(owNavDropdownOpen === itemId ? null : itemId);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (owNavSearchValue.trim()) {
      // Handle search functionality here
      console.log('Searching for:', owNavSearchValue);
      // Navigate to search results page
      // window.location.href = `/search?q=${encodeURIComponent(owNavSearchValue)}`;
    }
  };

  return (
    <div className={`ow-navbar-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <nav className="ow-navbar-container">
        <div className="ow-navbar-content">
          {/* Logo */}
          <div className="ow-navbar-logo">
            <a href="/" className="ow-logo-link">
              <span className="ow-logo-text">Otaku</span>
              <span className="ow-logo-accent">Wave</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="ow-navbar-nav-desktop">
            {navItems.map((item) => (
              <div key={item.id} className="ow-nav-item-wrapper" ref={item.dropdown ? dropdownRef : null}>
                <div className="ow-nav-item">
                  <a
                    href={item.href}
                    className="ow-nav-link"
                    onClick={item.dropdown ? (e) => {
                      e.preventDefault();
                      handleDropdownToggle(item.id);
                    } : undefined}
                  >
                    {item.label}
                    {item.dropdown && (
                      <ChevronDown
                        className={`ow-nav-chevron ${owNavDropdownOpen === item.id ? 'ow-nav-chevron-open' : ''}`}
                        size={16}
                      />
                    )}
                  </a>
                </div>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div className={`ow-dropdown-menu ${owNavDropdownOpen === item.id ? 'ow-dropdown-open' : ''}`}>
                    <div className="ow-dropdown-content">
                      {item.dropdown.map((dropItem, index) => (
                        <a
                          key={index}
                          href={dropItem.href}
                          className="ow-dropdown-item"
                        >
                          {dropItem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="ow-navbar-search">
            <form onSubmit={handleSearchSubmit} className="ow-search-form">
              <input
                type="text"
                placeholder="Search anime..."
                value={owNavSearchValue}
                onChange={(e) => setOwNavSearchValue(e.target.value)}
                className="ow-search-input"
              />
              <button type="submit" className="ow-search-button">
                <Search size={18} />
              </button>
            </form>
          </div>

          <div className="ow-navbar-auth" ref={dropdownRef}>
            {state ? (
              // Logged in - show single logout button
              <div className="ow-nav-item-wrapper">
                <div className="ow-nav-item">
                  <a
                    href={authOptions.loggedIn[1].href}
                    className="ow-nav-link"
                   onClick={authOptions.loggedIn[1].onClick}
                   style={{cursor:"pointer"}}
                  >
                    <span className="ow-auth-icon">
                      {authOptions.loggedIn[1].icon}
                    </span>
                    <span className="ow-auth-label">
                      {authOptions.loggedIn[1].label}
                    </span>
                  </a>
                </div>
              </div>
            ) : (
              // Logged out - show dropdown with login/signup
              <div className="ow-nav-item-wrapper">
                <div className="ow-nav-item">
                  <a
                    href="#"
                    className="ow-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDropdownToggle('ow-auth-dropdown');
                    }}
                  >
                    <span className="ow-auth-icon">
                      <User size={18} />
                    </span>
                    <span className="ow-auth-label">
                      Account
                    </span>
                    <ChevronDown
                      className={`ow-nav-chevron ${owNavDropdownOpen === 'ow-auth-dropdown' ? 'ow-nav-chevron-open' : ''}`}
                      size={16}
                    />
                  </a>
                </div>

                <div className={`ow-dropdown-menu ${owNavDropdownOpen === 'ow-auth-dropdown' ? 'ow-dropdown-open' : ''}`}>
                  <div className="ow-dropdown-content">
                    {authOptions.loggedOut.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="ow-dropdown-item"
                      >
                        <span className="ow-dropdown-icon">
                          {item.icon}
                        </span>
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="ow-navbar-actions">
            <button
              onClick={toggleTheme}
              className="ow-theme-toggle"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setOwNavMobileOpen(!owNavMobileOpen)}
              className="ow-mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {owNavMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`ow-navbar-mobile ${owNavMobileOpen ? 'ow-mobile-open' : ''}`}>
        <div className="ow-mobile-search">
          <form onSubmit={handleSearchSubmit} className="ow-search-form">
            <input
              type="text"
              placeholder="Search anime..."
              value={owNavSearchValue}
              onChange={(e) => setOwNavSearchValue(e.target.value)}
              className="ow-search-input"
            />
            <button type="submit" className="ow-search-button">
              <Search size={18} />
            </button>
          </form>
        </div>
        <div className="ow-mobile-auth-options">
          {state ? (
            // Logged in mobile options
            authOptions.loggedIn.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="ow-mobile-nav-link"
                onClick={item.onClick ? (e) => {
                  e.preventDefault();
                  item.onClick();
                } : undefined}
              >
                <span className="ow-mobile-auth-icon">
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))
          ) : (
            // Logged out mobile options
            authOptions.loggedOut.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="ow-mobile-nav-link"
              >
                <span className="ow-mobile-auth-icon">
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))
          )}
        </div>

        <div className="ow-mobile-nav-items">
          {navItems.map((item) => (
            <div key={item.id} className="ow-mobile-nav-item">
              <div className="ow-mobile-nav-link-wrapper">
                <a href={item.href} className="ow-mobile-nav-link">
                  {item.label}
                </a>
                {item.dropdown && (
                  <button
                    onClick={() => handleDropdownToggle(item.id)}
                    className="ow-mobile-dropdown-toggle"
                  >
                    <ChevronDown
                      className={`ow-nav-chevron ${owNavDropdownOpen === item.id ? 'ow-nav-chevron-open' : ''}`}
                      size={16}
                    />
                  </button>
                )}
              </div>

              {item.dropdown && (
                <div className={`ow-mobile-dropdown ${owNavDropdownOpen === item.id ? 'ow-mobile-dropdown-open' : ''}`}>
                  {item.dropdown.map((dropItem, index) => (
                    <a
                      key={index}
                      href={dropItem.href}
                      className="ow-mobile-dropdown-item"
                    >
                      {dropItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
    </div>
      </nav >

    </div >
  );
};

export default OtakuWaveNavbar;