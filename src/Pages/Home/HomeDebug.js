import React, { useState, useEffect } from 'react'
import "../Home/Home.css"
import axios from 'axios';
import api from '../../util/api';
import { useNavigate } from 'react-router-dom';

const HomeDebug = () => {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState({
    userDataExists: false,
    userData: null,
    loadedComponents: [],
    errors: []
  });

  useEffect(() => {
    // Check localStorage
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');
    
    let parsedUserData = null;
    try {
      parsedUserData = userData ? JSON.parse(userData) : null;
    } catch (err) {
      console.error('Error parsing userData:', err);
    }

    setDebugInfo(prev => ({
      ...prev,
      userDataExists: !!userData,
      userData: parsedUserData,
      debugMessages: [
        `userData exists: ${!!userData}`,
        `token exists: ${!!token}`,
        `userData content: ${JSON.stringify(parsedUserData)}`,
        `API URL: ${api.url}`
      ]
    }));

    // Try loading components
    const components = ['Nav', 'Left', 'Middle', 'Right'];
    components.forEach(comp => {
      try {
        require(`../../Components/${comp === 'Nav' ? 'Navigation' : comp.includes('Left') ? 'LeftSide' : comp.includes('Right') ? 'RightSide' : 'MiddleSide'}/${comp === 'Nav' ? 'Nav' : comp}.js`);
        setDebugInfo(prev => ({
          ...prev,
          loadedComponents: [...prev.loadedComponents, comp]
        }));
      } catch (err) {
        console.error(`Error loading ${comp}:`, err);
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors, `Failed to load ${comp}: ${err.message}`]
        }));
      }
    });
  }, []);

  if (!debugInfo.userDataExists) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#ffebee',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{color: '#c62828'}}>No User Data Found</h2>
          <p>User data not found in localStorage. Session may have expired.</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Debug Information</h2>
        
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h3 style={{margin: '0 0 10px 0'}}>User Data:</h3>
          <pre style={{margin: 0, fontSize: '12px', overflow: 'auto'}}>
            {JSON.stringify(debugInfo.userData, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
          <h3 style={{margin: '0 0 10px 0'}}>Loaded Components:</h3>
          <ul>
            {debugInfo.loadedComponents.map((comp, idx) => (
              <li key={idx}>{comp} ✓</li>
            ))}
          </ul>
        </div>

        {debugInfo.errors.length > 0 && (
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
            <h3 style={{margin: '0 0 10px 0', color: '#c62828'}}>Errors:</h3>
            <ul>
              {debugInfo.errors.map((err, idx) => (
                <li key={idx} style={{color: '#c62828'}}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <button 
          onClick={() => navigate('/home')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Try Home Page
        </button>

        <button 
          onClick={() => {
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
            navigate('/');
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomeDebug;
