import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../../context/UserContext';
import { Button, Form, Card, Container } from '../../Components/UI';
import { theme } from '../../theme/theme';
import { authAPI } from '../../api/apiService';
import CookieUtil from '../../util/cookieUtil';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%);
  padding: ${theme.spacing[4]};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  border-radius: ${theme.borderRadius.lg};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[8]};

  h1 {
    font-size: ${theme.typography.fontSize['3xl']};
    margin: 0 0 ${theme.spacing[2]} 0;
    color: ${theme.colors.text};

    .highlight {
      color: ${theme.colors.primary};
      font-weight: ${theme.typography.fontWeight.bold};
    }
  }

  p {
    color: ${theme.colors.textLight};
    margin: 0;
  }
`;

const AlertBox = styled.div`
  padding: ${theme.spacing[3]};
  background-color: ${theme.colors.errorLight};
  border-left: 4px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.base};
  margin-bottom: ${theme.spacing[4]};
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm};
`;

const FooterLink = styled.div`
  text-align: center;
  margin-top: ${theme.spacing[4]};
  font-size: ${theme.typography.fontSize.sm};

  p {
    margin: 0;
    color: ${theme.colors.textLight};
  }

  a {
    color: ${theme.colors.primary};
    font-weight: ${theme.typography.fontWeight.semibold};
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primaryDark};
    }
  }
`;

const OTPModal = styled.div`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
`;

const OTPContent = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  max-width: 400px;
  width: 100%;
  box-shadow: ${theme.shadows.xl};

  h3 {
    margin: 0 0 ${theme.spacing[2]} 0;
    font-size: ${theme.typography.fontSize['2xl']};
    color: ${theme.colors.text};
  }

  p {
    margin: 0 0 ${theme.spacing[4]} 0;
    color: ${theme.colors.textLight};
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const OTPInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.typography.fontSize.lg};
  letter-spacing: ${theme.typography.letterSpacing.wide};
  text-align: center;
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.base};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing[3]};
  transition: border-color ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &:disabled {
    background-color: ${theme.colors.backgroundTertiary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const Login = () => {
  const navigate = useNavigate();
  const { setUserData } = useUser();
  
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [serverOtp, setServerOtp] = useState(null);
  const [userData, setUserDataLocal] = useState(null);
  const [loginToken, setLoginToken] = useState(null);
  const [otpAttempts, setOtpAttempts] = useState(0);
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      navigate('/home');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error[name]) {
      setError(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setLoading(true);
    setError({});

    try {
      const result = await authAPI.login(credentials);
      
      if (result.auth && result.user) {
        setUserDataLocal(result.user);
        setLoginToken(result.token);
        setServerOtp(result.otp);
        setOtpAttempts(0);
        setShowModal(true);
        setOtpInput('');
      } else {
        setError({ credentials: result.message || 'Login failed' });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError({ credentials: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpInput.trim()) {
      setOtpError('OTP is required');
      return;
    }

    if (otpAttempts >= 3) {
      setOtpError('Maximum OTP attempts exceeded. Please login again.');
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
      return;
    }

    if (otpInput === String(serverOtp)) {
      try {
        setLoading(true);
        
        localStorage.setItem('token', loginToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('access_token', loginToken);
        CookieUtil.setCookie('access', loginToken);
        
        setUserData(userData);
        
        setOtpError('');
        setShowModal(false);
        
        setTimeout(() => {
          navigate('/home');
        }, 500);
      } catch (err) {
        console.error('OTP verification error:', err);
        setOtpError('Verification failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setOtpAttempts(prev => prev + 1);
      setOtpError(`Invalid OTP. Attempts remaining: ${3 - otpAttempts - 1}`);
      setOtpInput('');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOtpInput('');
    setOtpError('');
    setOtpAttempts(0);
    setCredentials({ username: '', password: '' });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Card.Body style={{ padding: theme.spacing[6] }}>
          <Header>
            <h1>
              Login to <span className="highlight">Nos</span>talgia
            </h1>
            <p>Welcome back! Please sign in to continue.</p>
          </Header>

          {error.credentials && <AlertBox>{error.credentials}</AlertBox>}

          <Form onSubmit={handleLogin}>
            <Form.Input
              label="Username"
              name="username"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleInputChange}
              error={error.username}
              disabled={loading}
              required
            />

            <Form.Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
              error={error.password}
              disabled={loading}
              required
            />

            <Button type="submit" fullWidth size="large" disabled={loading}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </Button>
          </Form>

          <FooterLink>
            <p>
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
          </FooterLink>
        </Card.Body>
      </LoginCard>

      <OTPModal show={showModal}>
        <OTPContent>
          <h3>Verify OTP</h3>
          <p>An OTP has been sent to your registered email. Enter it below to continue.</p>
          
          <OTPInput
            type="text"
            value={otpInput}
            onChange={(e) => {
              setOtpInput(e.target.value);
              setOtpError('');
            }}
            placeholder="0000"
            maxLength="6"
            disabled={loading}
          />

          {otpError && <AlertBox>{otpError}</AlertBox>}

          <ButtonGroup>
            <Button
              variant="secondary"
              fullWidth
              onClick={handleCloseModal}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              fullWidth
              onClick={handleOtpSubmit}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </ButtonGroup>
        </OTPContent>
      </OTPModal>
    </LoginContainer>
  );
};

export default Login;
