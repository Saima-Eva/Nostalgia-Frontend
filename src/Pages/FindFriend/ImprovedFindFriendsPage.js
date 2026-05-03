import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Button, Form, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FriendCard from '../../Components/FindF/FriendCard';
import friendAPI from '../../util/friendApi';
import Nav from '../../Components/Navigation/Nav';
import Left from '../../Components/LeftSide/Left';
import './ImprovedFindFriendsPage.css';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    gap: 15px;
    padding: 15px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
    padding: 10px;
  }
`;

const LeftSideWrapper = styled.div`
  flex: 0 0 260px;
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
    width: 100%;
  }
`;

const PageContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  overflow-y: auto;
  min-height: calc(100vh - 100px);

  @media (max-width: 1024px) {
    padding: 15px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 0;
    min-height: auto;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;

    h1 {
      font-size: 24px;
    }
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;

  input, select {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }

  input {
    flex: 1;
    min-width: 200px;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    input {
      width: 100%;
      min-width: auto;
    }

    select {
      width: 100%;
    }
  }
`;

const FriendsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  flex-wrap: wrap;

  button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;

    &:hover:not(:disabled) {
      background: #f0f0f0;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }
  }

  @media (max-width: 480px) {
    button {
      padding: 6px 10px;
      font-size: 12px;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;

  h3 {
    font-size: 20px;
    color: #666;
    margin-bottom: 8px;
  }

  p {
    color: #999;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    padding: 40px 20px;

    h3 {
      font-size: 18px;
    }
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;

  div {
    strong {
      color: #333;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

/**
 * Improved Find Friends Page with Suggestions
 */
const ImprovedFindFriendsPage = () => {
  const [userData, setUserData] = useState(null);
  const [search, setSearch] = useState('');
  const [thanaFilter, setThanaFilter] = useState('');
  const [activeTab, setActiveTab] = useState('find'); // 'find' or 'suggestions'
  const [friendFilter, setFriendFilter] = useState('all'); // 'all', 'friends', 'sent', 'incoming'

  // Find Friends state
  const [potentialFriends, setPotentialFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [errorFriends, setErrorFriends] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(12);

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [errorSuggestions, setErrorSuggestions] = useState('');

  // Initialize user data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userData');
      const user = stored ? JSON.parse(stored) : null;
      setUserData(user);
    } catch (err) {
      console.error('Error parsing userData in ImprovedFindFriendsPage:', err);
      setUserData(null);
    }
  }, []);

  // Fetch potential friends
  const fetchPotentialFriends = async (pageNum = 1) => {
    if (!userData || !userData.id) {
      setLoadingFriends(false);
      return;
    }
    setLoadingFriends(true);
    setErrorFriends('');
    try {
      const result = await friendAPI.findFriends(
        userData.id,
        pageNum,
        pageSize,
        search,
        thanaFilter,
        friendFilter
      );

      if (result.success) {
        setPotentialFriends(result.data.users);
        setTotalPages(result.data.total_pages);
        setTotalCount(result.data.total_count);
        setPage(pageNum);
      } else {
        setErrorFriends(result.error);
      }
    } catch (err) {
      setErrorFriends('Failed to load potential friends');
    } finally {
      setLoadingFriends(false);
    }
  };

  // Fetch suggestions
  const fetchSuggestions = async () => {
    if (!userData || !userData.id) {
      setLoadingSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    setErrorSuggestions('');
    try {
      const result = await friendAPI.getSuggestions(userData.id, 20);
      if (result.success) {
        setSuggestions(result.data.suggestions);
      } else {
        setErrorSuggestions(result.error);
      }
    } catch (err) {
      setErrorSuggestions('Failed to load suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (!userData || !userData.id) return;
    
    if (activeTab === 'find') {
      fetchPotentialFriends(1);
    } else {
      fetchSuggestions();
    }
  }, [activeTab, userData]);

  // Fetch when search/filter changes
  useEffect(() => {
    if (!userData || !userData.id) return;
    
    if (activeTab === 'find') {
      fetchPotentialFriends(1);
    }
  }, [search, thanaFilter, friendFilter, userData, activeTab]);

  const handleStatusChange = (friendId, newType) => {
    setPotentialFriends(potentialFriends.map(f =>
      f.id === friendId ? { ...f, type: newType } : f
    ));
  };

  const handleRemoveFriend = (friendId) => {
    if (activeTab === 'find') {
      setPotentialFriends(potentialFriends.filter(f => f.id !== friendId));
    } else {
      setSuggestions(suggestions.filter(s => s.id !== friendId));
    }
  };

  // Filter friends based on friendFilter state
  const getFilteredFriends = () => {
    return potentialFriends;
  };

  const filteredFriends = getFilteredFriends();

  const pageNumbers = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pageNumbers.push(i);
  }

  // Don't render if user data isn't loaded yet
  if (!userData) {
    return (
      <MainWrapper>
        <Nav />
      </MainWrapper>
    );
  }

  if (userData.username.includes('@')) {
    return (
      <MainWrapper>
        <Nav />
        <h1 className="error mt-4">You are not allowed to view this page</h1>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <Nav />
      <ContentWrapper>
        <LeftSideWrapper>
          <Left />
        </LeftSideWrapper>

        <PageContainer>
          <Header>
            <h1>Find Friends</h1>
            <p>Discover and connect with new people</p>
          </Header>

          <Tabs
            id="find-friends-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            {/* Find Friends Tab */}
            <Tab eventKey="find" title="Search & Discover">
              {errorFriends && (
                <Alert variant="danger" onClose={() => setErrorFriends('')} dismissible>
                  {errorFriends}
                </Alert>
              )}

              <FilterBar>
                <Form.Control
                  type="text"
                  placeholder="Search by name, username, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Form.Select value={thanaFilter} onChange={(e) => setThanaFilter(e.target.value)}>
                  <option value="">All Locations</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Rajshahi">Rajshahi</option>
                </Form.Select>
              </FilterBar>

              {/* Friendship Filter Buttons */}
              <div className="d-flex flex-wrap gap-2 mb-3" style={{marginBottom: '20px'}}>
                <h6 style={{marginRight: '10px', marginTop: '5px'}}>Filter By:</h6>
                <Button
                  variant={friendFilter === 'all' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFriendFilter('all')}
                  style={{borderRadius: '20px'}}
                >
                  ALL
                </Button>
                <Button
                  variant={friendFilter === 'friends' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFriendFilter('friends')}
                  style={{borderRadius: '20px'}}
                >
                  My Friends
                </Button>
                <Button
                  variant={friendFilter === 'sent' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFriendFilter('sent')}
                  style={{borderRadius: '20px'}}
                >
                  Requests I Sent
                </Button>
                <Button
                  variant={friendFilter === 'incoming' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFriendFilter('incoming')}
                  style={{borderRadius: '20px'}}
                >
                  Requests Sent to Me
                </Button>
              </div>

              <Stats>
                <div>Total Found: <strong>{totalCount}</strong></div>
                <div>
                  Showing <strong>{filteredFriends.length}</strong> on this page
                </div>
              </Stats>

              {loadingFriends ? (
                <LoadingContainer>
                  <Spinner animation="border" />
                </LoadingContainer>
              ) : filteredFriends.length === 0 ? (
                <EmptyState>
                  <h3>No users found</h3>
                  <p>Try adjusting your search or filters</p>
                </EmptyState>
              ) : (
                <>
                  <FriendsGrid>
                      {filteredFriends.map(friend => {
                        let dynamicVariant = 'suggestion';
                        if (friend.is_fnf === 1) dynamicVariant = 'friend';
                        else if (friend.is_fnf === 0 && friend.abedon === 0 && friend.status === 1) dynamicVariant = 'incoming';
                        else if (friend.is_fnf === 0 && friend.abedon === 1 && friend.status === 1) dynamicVariant = 'sent';
                        
                        return (
                          <FriendCard
                            key={friend.id}
                            friend={friend}
                            onStatusChange={handleStatusChange}
                            onRemove={handleRemoveFriend}
                            userData={userData}
                            showMutualCount={true}
                            variant={dynamicVariant}
                          />
                        );
                      })}
                    </FriendsGrid>
                    
                    {totalPages > 1 && (
                      <PaginationContainer>
                        <Button
                          disabled={page === 1}
                          onClick={() => fetchPotentialFriends(page - 1)}
                          variant="outline-primary"
                        >
                        Previous
                      </Button>
                      {pageNumbers.map(num => (
                        <Button
                          key={num}
                          onClick={() => fetchPotentialFriends(num)}
                          variant={page === num ? 'primary' : 'outline-primary'}
                          className={page === num ? 'active' : ''}
                        >
                          {num}
                        </Button>
                      ))}
                      <Button
                        disabled={page === totalPages}
                        onClick={() => fetchPotentialFriends(page + 1)}
                        variant="outline-primary"
                      >
                        Next
                      </Button>
                    </PaginationContainer>
                  )}
                </>
              )}
            </Tab>

            {/* Suggestions Tab */}
            <Tab eventKey="suggestions" title={`Suggestions ${suggestions.length > 0 ? `(${suggestions.length})` : ''}`}>
              {errorSuggestions && (
                <Alert variant="danger" onClose={() => setErrorSuggestions('')} dismissible>
                  {errorSuggestions}
                </Alert>
              )}

              <Stats>
                <div>Total Suggestions: <strong>{suggestions.length}</strong></div>
                <div>Based on <strong>mutual friends</strong></div>
              </Stats>

              {loadingSuggestions ? (
                <LoadingContainer>
                  <Spinner animation="border" />
                </LoadingContainer>
              ) : suggestions.length === 0 ? (
                <EmptyState>
                  <h3>No suggestions yet</h3>
                  <p>When you make friends, we'll suggest people based on mutual connections</p>
                </EmptyState>
              ) : (
                <FriendsGrid>
                  {suggestions.map(friend => (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      onStatusChange={handleStatusChange}
                      onRemove={handleRemoveFriend}
                      userData={userData}
                      showMutualCount={true}
                      variant="suggestion"
                    />
                  ))}
                </FriendsGrid>
              )}
            </Tab>
          </Tabs>
        </PageContainer>
      </ContentWrapper>
    </MainWrapper>
  );
};

export default ImprovedFindFriendsPage;
