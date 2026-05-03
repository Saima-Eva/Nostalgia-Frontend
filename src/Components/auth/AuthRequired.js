import React, { useEffect, useState } from "react";
import CookieUtil from "../../util/cookieUtil";
import { useNavigate } from 'react-router-dom';

const AuthRequired = (Component) => {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

    useEffect(() => {
      checkAuth();
    }, []); // Empty dependency array - run once on mount

    const checkAuth = () => {
      // Check both cookie and localStorage
      const accessCookie = CookieUtil.getCookie('access');
      const accessToken = localStorage.getItem('token');
      
      if (accessCookie || accessToken) {
        setIsAuthenticated(true);
      } else {
        // Not authenticated, redirect to login
        navigate('/');
        setIsAuthenticated(false);
      }
    };

    // Show loading state while checking auth
    if (isAuthenticated === null) {
      return (
        <div style={{
          display: 'flex',
          justify: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', color: '#333' }}>Loading...</p>
          </div>
        </div>
      );
    }

    // Render the component only if authenticated
    return isAuthenticated ? <Component {...props} /> : null;
  };
};

export default AuthRequired;
