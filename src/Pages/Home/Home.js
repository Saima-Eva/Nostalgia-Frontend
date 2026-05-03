import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import api from '../../util/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { theme } from '../../theme/theme';
import { LayoutContainer, Sidebar, MainContent, LoadingSpinner, EmptyState, Flex } from '../../Components/UI';
import Nav from '../../Components/Navigation/Nav';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${theme.colors.backgroundSecondary};
  gap: ${theme.spacing[4]};
  flex-direction: column;
`;

const LoadingFallback = ({ text = "Loading..." }) => (
  <Flex direction="column" align="center" justify="center">
    <LoadingSpinner />
    <p style={{ color: theme.colors.textLight }}>{text}</p>
  </Flex>
);

const Left = lazy(() => 
  import("../../Components/LeftSide/Left").catch(err => {
    console.error('Error loading Left:', err);
    return { default: () => <div /> };
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
    return { default: () => <div /> };
  })
);

const HomeContainer = styled(LayoutContainer)`
  gap: ${theme.spacing[4]};
  padding-top: 0;
`;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, isLoading: contextLoading } = useUser();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contextLoading) {
      if (!userData || !userData.username) {
        navigate('/');
      } else if (userData.username.includes("@")) {
        navigate('/');
      }
    }
  }, [userData, contextLoading, navigate]);

  // Check if we have search results passed from Nav component
  useEffect(() => {
    if (location.state?.searchResults && location.state?.searchResults.length > 0) {
      console.log('[HOME] Found search results from navigation:', location.state.searchResults.length, 'posts');
      setPosts(location.state.searchResults);
      setLoading(false);
      
      // Clear the location state to prevent reusing search results after navigation
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [location.state]);

  const fetchPosts = useCallback((user) => {
    if (!user || !user.username) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const timeout = setTimeout(() => {
      console.warn('Posts fetch timeout - backend may be offline');
      setPosts([]);
      setLoading(false);
    }, 8000);

    axios.get(`/htimeline`, {
      params: { username: user.username },
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        clearTimeout(timeout);
        const postsData = Array.isArray(response.data) ? response.data : [];
        setPosts(postsData);
        setLoading(false);
      })
      .catch(error => {
        clearTimeout(timeout);
        console.error('Error fetching posts:', error);
        setPosts([]);
        setLoading(false);
      });
  }, []);

  // Effect to load regular feed if no search results were provided
  useEffect(() => {
    if (!contextLoading && userData && userData.username && posts.length === 0 && !loading) {
      // Only load if posts is still empty after checking for search results
      console.log('[HOME] Loading regular feed for user:', userData.username);
      fetchPosts(userData);
    } else if (!contextLoading && userData && userData.username && posts.length === 0 && loading) {
      // If we have no posts and loading is true, but no search results came through, fetch feed
      if (!location.state?.searchResults) {
        console.log('[HOME] No search results found, loading regular feed');
        fetchPosts(userData);
      }
    }
  }, [contextLoading, userData?.username, fetchPosts, location.state]);

  const handleRefreshPosts = useCallback(() => {
    // Load fresh feed
    if (userData && userData.username) {
      fetchPosts(userData);
    }
  }, [userData, fetchPosts]);

  if (contextLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p style={{ color: theme.colors.textLight }}>Initializing...</p>
      </LoadingContainer>
    );
  }

  return (
    <>
      <Nav setPosts={setPosts} />
      
      <HomeContainer>
        <Sidebar>
          <Suspense fallback={<div />}>
            <Left />
          </Suspense>
        </Sidebar>

        <MainContent>
          <Suspense fallback={<LoadingFallback text="Loading feed..." />}>
            <Middle posts={posts} loading={loading} onRefresh={handleRefreshPosts} />
          </Suspense>
        </MainContent>

        <Sidebar>
          <Suspense fallback={<div />}>
            <Right />
          </Suspense>
        </Sidebar>
      </HomeContainer>
    </>
  );
};

export default Home;