import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import api from '../../util/api';
import friendAPI from '../../util/friendApi';
import 'bootstrap/dist/css/bootstrap.min.css';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
  max-width: 300px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
  border: 3px solid #007bff;
`;

const NoImagePlaceholder = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #ddd;
  margin-bottom: 12px;
  font-size: 12px;
  color: #999;
  text-align: center;
  padding: 10px;
`;

const UserInfo = styled.div`
  margin-bottom: 12px;
  width: 100%;

  h4 {
    margin: 8px 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;

    a {
      text-decoration: none;
      color: #007bff;
      &:hover {
        color: #0056b3;
      }
    }
  }

  p {
    margin: 0 4px 0 0;
    font-size: 14px;
    color: #666;
  }

  .meta-info {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
`;

const MutualFriends = styled.div`
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  width: 100%;

  strong {
    color: #007bff;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;

  button, .dropdown-toggle {
    flex: 1;
    min-width: 80px;
    font-size: 12px;
    padding: 6px 8px;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(0, 123, 255, 0.3);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorAlert = styled.div`
  color: #d32f2f;
  font-size: 12px;
  background: #ffebee;
  padding: 6px;
  border-radius: 4px;
  margin-top: 8px;
`;

/**
 * Improved Friend Card Component
 */
const FriendCard = ({
  friend,
  onStatusChange,
  onRemove,
  userData,
  showMutualCount = false,
  variant = 'friend' // 'friend', 'suggestion', or 'incoming'
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionType, setActionType] = useState((friend.is_fnf === 0 && friend.abedon === 1) ? 'Sent' : (friend.type || 'Known'));

  const handleAddFriend = async () => {
    setLoading(true);
    setError('');
    try {
      console.log(`[FriendCard] Sending friend request from ${userData.id} to ${friend.id}`);
      const result = await friendAPI.sendFriendRequest(userData.id, friend.id);
      console.log('[FriendCard] sendFriendRequest result:', result);
      if (result.success) {
        setActionType('Sent');
        if (onStatusChange) onStatusChange(friend.id, 'Sent');
      } else {
        setError(result.error || 'Failed to send friend request');
      }
    } catch (err) {
      console.error('[FriendCard] Exception in handleAddFriend:', err);
      setError('Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = async (newType) => {
    setLoading(true);
    setError('');
    try {
      console.log(`[FriendCard] Updating friend status from ${userData.id} to ${friend.id} as ${newType}`);
      const result = await friendAPI.updateFriendStatus(userData.id, friend.id, newType);
      console.log('[FriendCard] updateFriendStatus result:', result);
      if (result.success) {
        setActionType(newType);
        if (onStatusChange) onStatusChange(friend.id, newType);
      } else {
        setError(result.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('[FriendCard] Exception in handleTypeChange:', err);
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!window.confirm('Are you sure you want to unfriend this user?')) return;

    setLoading(true);
    setError('');
    try {
      console.log(`[FriendCard] Removing friend from ${userData.id} to ${friend.id}`);
      const result = await friendAPI.removeFriend(userData.id, friend.id);
      console.log('[FriendCard] removeFriend result:', result);
      if (result.success) {
        if (onRemove) onRemove(friend.id);
      } else {
        setError(result.error || 'Failed to remove friend');
      }
    } catch (err) {
      console.error('[FriendCard] Exception in handleRemoveFriend:', err);
      setError('Failed to remove friend');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setLoading(true);
    setError('');
    try {
      console.log(`[FriendCard] Accepting friend request from ${userData.id} to ${friend.id}`);
      const result = await friendAPI.updateFriendStatus(userData.id, friend.id, 'Accept');
      console.log('[FriendCard] acceptRequest result:', result);
      if (result.success) {
        setActionType('Accept');
        if (onStatusChange) onStatusChange(friend.id, 'Accept');
      } else {
        setError(result.error || 'Failed to accept friend request');
      }
    } catch (err) {
      console.error('[FriendCard] Exception in handleAcceptRequest:', err);
      setError('Failed to accept friend request');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = async () => {
    if (!window.confirm('Decline this friend request?')) return;

    setLoading(true);
    setError('');
    try {
      console.log(`[FriendCard] Declining friend request from ${userData.id} to ${friend.id}`);
      const result = await friendAPI.removeFriend(userData.id, friend.id);
      console.log('[FriendCard] declineRequest result:', result);
      if (result.success) {
        if (onRemove) onRemove(friend.id);
      } else {
        setError(result.error || 'Failed to decline friend request');
      }
    } catch (err) {
      console.error('[FriendCard] Exception in handleDeclineRequest:', err);
      setError('Failed to decline friend request');
    } finally {
      setLoading(false);
    }
  };

  const hasProfilePicture = friend.pp && friend.pp.trim() !== '';

  return (
    <CardContainer>
      {hasProfilePicture ? (
        <Link to={`/profile/${friend.username}`}>
          <ProfileImage
            src={friend.pp.includes('http') ? friend.pp : (friend.pp.startsWith('/') ? `${api.url}:8000${friend.pp}` : `${api.url}:8000/${friend.pp}`)}
            alt={friend.username}
          />
        </Link>
      ) : (
        <NoImagePlaceholder>
          No image available
        </NoImagePlaceholder>
      )}

      <UserInfo>
        <h4>
          <Link to={`/profile/${friend.username}`}>
            {friend.first_name} {friend.last_name}
          </Link>
        </h4>
        <p>@{friend.username}</p>
        <div className="meta-info">
          {friend.thana && <span>{friend.thana}</span>}
        </div>
      </UserInfo>

      {showMutualCount && friend.mutual_count !== undefined && (
        <MutualFriends>
          <strong>{friend.mutual_count}</strong> mutual friends
        </MutualFriends>
      )}

      {error && <ErrorAlert>{error}</ErrorAlert>}

      <ActionButtons>
        {variant === 'friend' ? (
          <>
            <DropdownButton
              title={actionType}
              variant="outline-secondary"
              disabled={loading}
              onSelect={handleTypeChange}
              size="sm"
            >
              <Dropdown.Item eventKey="Known">Known</Dropdown.Item>
              <Dropdown.Item eventKey="Bondhu">Bondhu</Dropdown.Item>
            </DropdownButton>
            <Link to={`/chat/${friend.username}`}>
              <Button
                variant="outline-primary"
                size="sm"
                disabled={loading}
              >
                Message
              </Button>
            </Link>
            <Button
              variant="outline-danger"
              size="sm"
              disabled={loading}
              onClick={handleRemoveFriend}
            >
              {loading ? <LoadingSpinner /> : 'Unfriend'}
            </Button>
          </>
        ) : variant === 'incoming' ? (
          <>
            <Button
              variant="success"
              size="sm"
              disabled={loading || actionType === 'Accept'}
              onClick={handleAcceptRequest}
            >
              {loading ? <LoadingSpinner /> : (actionType === 'Accept' ? '✓ Accepted' : 'Accept')}
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              disabled={loading}
              onClick={handleDeclineRequest}
            >
              {loading ? <LoadingSpinner /> : 'Decline'}
            </Button>
          </>
        ) : variant === 'sent' ? (
          <>
            <Button
              variant="outline-danger"
              size="sm"
              disabled={loading}
              onClick={handleRemoveFriend}
            >
              {loading ? <LoadingSpinner /> : 'Cancel Request'}
            </Button>
            <Link to={`/chat/${friend.username}`}>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={loading}
              >
                Message
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Button
              variant={actionType === 'Sent' ? 'success' : 'primary'}
              size="sm"
              disabled={loading || actionType === 'Sent'}
              onClick={handleAddFriend}
            >
              {loading ? <LoadingSpinner /> : (actionType === 'Sent' ? '✓ Request Sent' : 'Add Friend')}
            </Button>
            <Link to={`/chat/${friend.username}`}>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={loading}
              >
                Message
              </Button>
            </Link>
          </>
        )}
      </ActionButtons>
    </CardContainer>
  );
};

export default FriendCard;
