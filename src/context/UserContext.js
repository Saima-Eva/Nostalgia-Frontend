import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../util/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('userData');
      const storedToken = localStorage.getItem('token');
      
      if (storedData && storedToken) {
        const parsed = JSON.parse(storedData);
        setUserData(parsed);
      }
    } catch (err) {
      console.error('Error parsing userData from localStorage:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync userData changes back to localStorage
  useEffect(() => {
    if (userData) {
      try {
        localStorage.setItem('userData', JSON.stringify(userData));
      } catch (err) {
        console.error('Error saving userData to localStorage:', err);
      }
    }
  }, [userData]);

  const updateUserData = (newData) => {
    setUserData(newData);
  };

  const clearUserData = () => {
    setUserData(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
  };

  const getProfileImageUrl = () => {
    if (!userData) return null;
    
    // Use p_image_url if available (standard format)
    if (userData.p_image_url) {
      return `${api.url}:8000${userData.p_image_url}`;
    }
    
    // Fallback to p_image (alternative format)
    if (userData.p_image) {
      const imagePath = userData.p_image;
      if (imagePath.startsWith('media/') || imagePath.startsWith('/media/')) {
        return `${api.url}:8000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
      } else {
        return `${api.url}:8000/media/${imagePath}`;
      }
    }
    
    return null;
  };

  return (
    <UserContext.Provider 
      value={{ 
        userData, 
        setUserData: updateUserData,
        clearUserData,
        getProfileImageUrl,
        isLoading,
        error 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
