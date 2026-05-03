import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import {
  FaHome, FaBell, FaComments, FaUsers, FaSignOutAlt, FaBars, FaTimes, FaSearch
} from 'react-icons/fa';
import { theme } from '../../theme/theme';
import { useUser } from '../../context/UserContext';
import api from '../../util/api';
import DefaultProfile from '../../assets/profile.jpg';

// Styled Components

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  box-shadow: ${theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.sticky};
  gap: ${theme.spacing[4]};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    gap: ${theme.spacing[2]};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${theme.colors.textInverse};
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.xl};
  transition: transform ${theme.transitions.fast};
  letter-spacing: -0.02em;

  &:hover {
    transform: scale(1.05);
  }

  span {
    color: ${theme.colors.secondary};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.lg};
  }
`;

const SearchContainer = styled.form`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: ${theme.borderRadius.full};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  flex: 0 1 300px;
  transition: all ${theme.transitions.fast};
  border: 2px solid transparent;

  &:focus-within {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex: 0 1 200px;
    padding: ${theme.spacing[1]} ${theme.spacing[2]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: ${theme.colors.textInverse};
  font-size: ${theme.typography.fontSize.base};
  width: 100%;
  outline: none;
  margin-left: ${theme.spacing[2]};

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const SearchButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.textInverse};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${theme.spacing[2]};
  transition: all ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.secondary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  color: ${theme.colors.textInverse};

  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing[2]};
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textInverse};
  font-size: ${theme.typography.fontSize.lg};
  transition: all ${theme.transitions.fast};
  cursor: pointer;
  position: relative;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
    color: ${theme.colors.secondary};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.base};
    padding: ${theme.spacing[1]};

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textInverse};
  font-size: ${theme.typography.fontSize.lg};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
    color: ${theme.colors.secondary};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.base};
    padding: ${theme.spacing[1]};

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${theme.colors.secondary};
  transition: all ${theme.transitions.fast};
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 65px;
  right: 20px;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  z-index: ${theme.zIndex.dropdown};
  min-width: 220px;
  overflow: hidden;
  border: 1px solid ${theme.colors.borderLight};

  @media (max-width: ${theme.breakpoints.md}) {
    ${(props) => props.show && 'display: flex;'}
    flex-direction: column;
  }
`;

const MobileMenuLink = styled(Link)`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.text};
  text-decoration: none;
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  transition: all ${theme.transitions.fast};
  font-weight: ${theme.typography.fontWeight.medium};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${theme.colors.backgroundSecondary};
    color: ${theme.colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Nav = ({ setPosts, setShowMenu }) => {
  const { userData, getProfileImageUrl, clearUserData, setUserData } = useUser();
  const [search, setSearch] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const profileImage = getProfileImageUrl() || DefaultProfile;
  const username = userData?.username || 'profile';

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      console.log('Search query is empty');
      return;
    }

    if (!userData?.username) {
      console.log('User not logged in');
      return;
    }

    try {
      const searchUrl = `${api.url}:8000/search/`;
      console.log('Making search request to:', searchUrl, 'with query:', search.trim());
      
      axios.get(searchUrl, {
        params: {
          q: search.trim(),
          username: userData.username
        }
      }).then(response => {
        console.log('Search response status:', response.status);
        console.log('Search results count:', Array.isArray(response.data) ? response.data.length : 0);
        console.log('Search results data:', response.data);
        
        if (Array.isArray(response.data)) {
          console.log('Found', response.data.length, 'search results');
          setSearch('');
          // Navigate to home with search results in location state
          // This state won't persist after navigation away, so it's temporary
          navigate('/home', { 
            state: { 
              searchResults: response.data,
              searchQuery: search.trim()
            }
          });
        } else if (response.data && response.data.results) {
          console.log('Found', response.data.results.length, 'search results');
          setSearch('');
          navigate('/home', { 
            state: { 
              searchResults: response.data.results,
              searchQuery: search.trim()
            }
          });
        } else {
          console.log('Unexpected response format, navigating to home');
          setSearch('');
          navigate('/home');
        }
      }).catch(error => {
        console.error('Search error:', error);
        console.error('Error response:', error.response?.data);
        navigate('/home');
      });
    } catch (error) {
      console.error('Search request error:', error);
      navigate('/home');
    }
  };

  const handleLogout = async () => {
    try {
      clearUserData();
      localStorage.clear();
      setUserData(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      <NavBar>
        <Logo to="/home">
          Nos<span>talgia</span>
        </Logo>

        <SearchContainer onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
          />
          <SearchButton type="submit" title="Search">
            <FaSearch />
          </SearchButton>
        </SearchContainer>

        <NavIcons>
          <NavLink to="/home" title="Home">
            <FaHome />
          </NavLink>
          <NavLink to="/notification" title="Notifications">
            <FaBell />
          </NavLink>
          <NavLink to="/chat" title="Messages">
            <FaComments />
          </NavLink>
          <NavLink
            to="/friend"
            title="Friends"
            onClick={() => setShowMenu && setShowMenu(true)}
          >
            <FaUsers />
          </NavLink>
          {userData?.username && (
            <NavLink to={`/profile/${username}`} title="Profile">
              <ProfileImage
                src={profileImage}
                alt="Profile"
                onError={(e) => {
                  e.target.src = DefaultProfile;
                }}
              />
            </NavLink>
          )}
          <NavButton
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            title="Menu"
            style={{ display: 'none' }}
            className="mobile-menu-toggle"
          >
            {showMobileMenu ? <FaTimes /> : <FaBars />}
          </NavButton>
        </NavIcons>

        <MobileMenu show={showMobileMenu}>
          <MobileMenuLink to="/home">
            <FaHome /> Home
          </MobileMenuLink>
          <MobileMenuLink to="/notification">
            <FaBell /> Notifications
          </MobileMenuLink>
          <MobileMenuLink to="/chat">
            <FaComments /> Chat
          </MobileMenuLink>
          <MobileMenuLink to="/friend">
            <FaUsers /> Friends
          </MobileMenuLink>
          {userData?.username && (
            <MobileMenuLink to={`/profile/${username}`}>
              Profile
            </MobileMenuLink>
          )}
          <MobileMenuLink
            as="button"
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              color: theme.colors.error,
              borderBottom: 'none',
            }}
          >
            <FaSignOutAlt /> Logout
          </MobileMenuLink>
        </MobileMenu>
      </NavBar>

      <style>{`
        @media (max-width: ${theme.breakpoints.md}) {
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Nav;