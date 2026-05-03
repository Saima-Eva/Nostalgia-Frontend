import React, { useState, useEffect, Suspense, lazy } from 'react'
import "../Home/Home.css"
import axios from 'axios';
import api from '../../util/api';
import { useNavigate } from 'react-router-dom';

// Loading fallback components
const LoadingFallback = ({ text = "Loading..." }) => (
  <div style={{
    padding: '40px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px'
  }}>
    {text}
  </div>
);

const NavFallback = () => (
  <nav className='m-0' style={{
    padding: '20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <h2>Nostalgia</h2>
  </nav>
);

// Lazy load components with error boundaries
const Nav = lazy(() => 
  import('../../Components/Navigation/Nav').catch(err => {
    console.error('Error loading Nav:', err);
    return { default: NavFallback };
  })
);

const Left = lazy(() => 
  import("../../Components/LeftSide/Left").catch(err => {
    console.error('Error loading Left:', err);
    return { default: () => <div></div> };
  })
);

const Middle = lazy(() => 
  import("../../Components/MiddleSide/Middle").catch(err => {
    console.error('Error loading Middle:', err);
    return { default: () => <LoadingFallback text="Feed temporarily unavailable" /> };
  })
);

const Right = lazy(() => 
  import("../../Components/RightSide/Right").catch(err => {
    console.error('Error loading Right:', err);
    return { default: () => <div></div> };
  })
);

const Home = () => {
  const navigate = useNavigate();
  
  // State management - all hooks at top level
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get userData on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      } else {
        setUserData(null);
      }
    } catch (err) {
      console.error('Error parsing userData:', err);
      setUserData(null);
    }
  }, []);

  // Fetch posts
  const fetchPosts = () => {
    if (!userData || !userData.username) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    axios.get(`${api.url}:8000/htimeline`, {
      params: {
        username: userData.username
      }
    })
      .then(response => {
        // Ensure response.data is an array
        const postsData = Array.isArray(response.data) ? response.data : [];
        setPosts(postsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError('Unable to load feed. Please refresh the page.');
        setPosts([]);
        setLoading(false);
      });
  };

  // Fetch posts on userData change
  useEffect(() => {
    if (userData && userData.username) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [userData]);

  // Show loading state while userData is being loaded
  if (!userData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '18px', color: '#333', marginBottom: '20px' }}>Loading user data...</p>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Back to Login
        </button>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Check if user is admin (contains @)
  if (userData.username && userData.username.includes("@")) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <h1 style={{ color: '#c62828' }}>You are not allowed to view this page</h1>
      </div>
    );
  }

  return (
    <div className='interface'>
      <Suspense fallback={<NavFallback />}>
        <Nav 
          setPosts={setPosts}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />
      </Suspense>
      
      <div className="home">
        <Suspense fallback={<div></div>}>
          <Left />
        </Suspense>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          {error && (
            <div style={{
              padding: '15px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '5px',
              margin: '10px',
              textAlign: 'center',
              borderLeft: '4px solid #c62828'
            }}>
              ⚠️ {error}
            </div>
          )}
          
          {loading ? (
            <LoadingFallback text="Loading your feed..." />
          ) : (
            <Suspense fallback={<LoadingFallback text="Loading feed components..." />}>
              <Middle 
                posts={posts}
                fetchPosts={fetchPosts}
              />
            </Suspense>
          )}
        </div>

        <Suspense fallback={<div></div>}>
          <Right
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            following={following}
            setFollowing={setFollowing}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
