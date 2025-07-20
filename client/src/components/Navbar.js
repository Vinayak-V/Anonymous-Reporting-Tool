import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, FileText, Search, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Shield className="inline mr-2" size={24} />
          Campus Reports
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/report" 
              className={`nav-link ${isActive('/report') ? 'active' : ''}`}
            >
              <FileText className="inline mr-1" size={16} />
              Submit Report
            </Link>
          </li>
          <li>
            <Link 
              to="/track" 
              className={`nav-link ${isActive('/track') ? 'active' : ''}`}
            >
              <Search className="inline mr-1" size={16} />
              Track Report
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  <User className="inline mr-1" size={16} />
                  Dashboard
                </Link>
              </li>
              <li>
                <button 
                  onClick={logout}
                  className="nav-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <LogOut className="inline mr-1" size={16} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                <User className="inline mr-1" size={16} />
                Authority Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 