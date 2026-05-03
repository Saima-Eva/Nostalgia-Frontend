import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FriendCard from '../../Components/FindF/FriendCard';
import friendAPI from '../../util/friendApi';
import Nav from '../../Components/Navigation/Nav';
import Left from '../../Components/LeftSide/Left';
import './ImprovedFriendPage.css';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
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

  input {
    flex: 1;
    min-width: 200px;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }

  select {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
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
 * Improved Friend List Page
 */
const ImprovedFriendPage = () => {
  const [userData, setUserData] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(12);

  // Initialize user data
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userData');
      const user = stored ? JSON.parse(stored) : null;
      setUserData(user);
    } catch (err) {
      console.error('Error parsing userData in ImprovedFriendPage:', err);
      setUserData(null);
    }
  }, []);

  // Fetch friends with current filters
  const fetchFriends = async (pageNum = 1) => {
    if (!userData || !userData.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await friendAPI.getFriends(
        userData.id,
        pageNum,
        pageSize,
        search,
        filterType
      );

      if (result.success) {
        setFriends(result.data.friends);
        setTotalPages(result.data.total_pages);
        setTotalCount(result.data.total_count);
        setPage(pageNum);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (userData && userData.id) {
      fetchFriends(1);
    }
  }, [userData, search, filterType]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleStatusChange = (friendId, newType) => {
    setFriends(friends.map(f =>
      f.id === friendId ? { ...f, type: newType } : f
    ));
  };

  const handleRemoveFriend = (friendId) => {
    setFriends(friends.filter(f => f.id !== friendId));
    setTotalCount(totalCount - 1);
  };

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
            <h1>Your Friends</h1>
            <p>Manage and connect with your friends</p>
          </Header>

          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <FilterBar>
            <Form.Control
              type="text"
              placeholder="Search friends by name or username..."
              value={search}
              onChange={handleSearch}
            />
            <Form.Select value={filterType} onChange={handleFilterChange}>
              <option value="">All Friends</option>
              <option value="Bondhu">Bondhu</option>
              <option value="Known">Known</option>
            </Form.Select>
          </FilterBar>

          <Stats>
            <div>Total Friends: <strong>{totalCount}</strong></div>
            <div>
              Showing <strong>{friends.length}</strong> on this page
            </div>
          </Stats>

          {loading ? (
            <LoadingContainer>
              <Spinner animation="border" />
            </LoadingContainer>
          ) : friends.length === 0 ? (
            <EmptyState>
              <h3>No friends found</h3>
              <p>
                {search || filterType
                  ? 'Try adjusting your filters'
                  : 'Visit the Find Friends page to add new friends'}
              </p>
            </EmptyState>
          ) : (
            <>
              <FriendsGrid>
                {friends.map(friend => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onStatusChange={handleStatusChange}
                    onRemove={handleRemoveFriend}
                    userData={userData}
                    variant="friend"
                  />
                ))}
              </FriendsGrid>

              {totalPages > 1 && (
                <PaginationContainer>
                  <Button
                    disabled={page === 1}
                    onClick={() => fetchFriends(page - 1)}
                    variant="outline-primary"
                  >
                    Previous
                  </Button>
                  {pageNumbers.map(num => (
                    <Button
                      key={num}
                      onClick={() => fetchFriends(num)}
                      variant={page === num ? 'primary' : 'outline-primary'}
                      className={page === num ? 'active' : ''}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    disabled={page === totalPages}
                    onClick={() => fetchFriends(page + 1)}
                    variant="outline-primary"
                  >
                    Next
                  </Button>
                </PaginationContainer>
              )}
            </>
          )}
        </PageContainer>
      </ContentWrapper>
    </MainWrapper>
  );
};

export default ImprovedFriendPage;
