import styled from 'styled-components';

// ============ BUTTONS ============
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${props => {
    if (props.size === 'small') return '8px 16px';
    if (props.size === 'large') return '16px 32px';
    return '12px 24px';
  }};
  
  font-size: ${props => {
    if (props.size === 'small') return '12px';
    if (props.size === 'large') return '16px';
    return '14px';
  }};
  
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  user-select: none;

  background-color: ${props => {
    if (props.variant === 'danger') return '#D32F2F';
    if (props.variant === 'success') return '#00B849';
    if (props.variant === 'warning') return '#F57C00';
    if (props.variant === 'secondary') return 'transparent';
    return '#0066CC';
  }};

  color: ${props => {
    if (props.variant === 'secondary') return '#0066CC';
    return 'white';
  }};

  border: ${props => {
    if (props.variant === 'secondary') return '1.5px solid #0066CC';
    return 'none';
  }};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows?.lg || '0 10px 15px rgba(0, 0, 0, 0.1)'};
    
    background-color: ${props => {
      if (props.variant === 'danger') return '#B71C1C';
      if (props.variant === 'success') return '#009938';
      if (props.variant === 'warning') return '#E65100';
      if (props.variant === 'secondary') return '#E3F2FD';
      return '#004499';
    }};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: ${props => {
      if (props.size === 'small') return '6px 12px';
      if (props.size === 'large') return '12px 24px';
      return '10px 16px';
    }};
    font-size: ${props => {
      if (props.size === 'small') return '11px';
      if (props.size === 'large') return '14px';
      return '13px';
    }};
  }
`;

// ============ CARD ============
export const Card = styled.div`
  background-color: ${props => props.theme.colors?.background || '#FFFFFF'};
  border: 1px solid ${props => props.theme.colors?.border || '#DADCE0'};
  border-radius: 12px;
  padding: ${props => props.padding || '16px'};
  box-shadow: ${props => props.theme.shadows?.sm || '0 1px 3px rgba(0, 0, 0, 0.1)'};
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: ${props => props.theme.shadows?.lg || '0 10px 15px rgba(0, 0, 0, 0.1)'};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: ${props => props.padding || '12px'};
  }
`;

// ============ INPUT ============
export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1.5px solid ${props => props.theme.colors?.border || '#DADCE0'};
  border-radius: 8px;
  background-color: ${props => props.theme.colors?.background || '#FFFFFF'};
  color: ${props => props.theme.colors?.text?.primary || '#1A1A1A'};
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;

  &::placeholder {
    color: ${props => props.theme.colors?.text?.tertiary || '#9AA0A6'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors?.primary || '#0066CC'};
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors?.primary || '#0066CC'};
  }

  &:disabled {
    background-color: ${props => props.theme.colors?.surface || '#F5F7FA'};
    color: ${props => props.theme.colors?.text?.disabled || '#BDBDBD'};
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props => props.error && `
    border-color: #D32F2F;
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  `}
`;

// ============ LABEL ============
export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.colors?.text?.primary || '#1A1A1A'};
  user-select: none;

  ${props => props.required && `
    &::after {
      content: ' *';
      color: #D32F2F;
      margin-left: 4px;
    }
  `}
`;

// ============ FORM GROUP ============
export const FormGroup = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`;

// ============ ERROR TEXT ============
export const ErrorText = styled.span`
  color: #D32F2F;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  font-weight: 500;
`;

// ============ FLEX CONTAINER ============
export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '8px'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  flex-direction: ${props => props.direction || 'row'};
`;

// ============ GRID CONTAINER ============
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.minWidth || '280px'}, 1fr));
  gap: ${props => props.gap || '16px'};
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// ============ CONTAINER ============
export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;

  @media (max-width: 768px) {
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    padding: 0 8px;
  }
`;

// ============ TEXT COMPONENTS ============
export const Heading = styled.h1`
  font-size: ${props => {
    if (props.size === 'h1') return '32px';
    if (props.size === 'h2') return '28px';
    if (props.size === 'h3') return '24px';
    if (props.size === 'h4') return '20px';
    if (props.size === 'h5') return '16px';
    return '28px';
  }};
  
  font-weight: 700;
  line-height: 1.2;
  color: ${props => props.theme.colors?.text?.primary || '#1A1A1A'};
  margin: 0 0 12px 0;
  letter-spacing: -0.2px;
`;

export const Paragraph = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${props => props.theme.colors?.text?.secondary || '#5F6368'};
  margin: 0 0 12px 0;

  &:last-child {
    margin-bottom: 0;
  }

  ${props => props.muted && `
    color: ${props.theme.colors?.text?.tertiary || '#9AA0A6'};
  `}

  ${props => props.bold && `
    font-weight: 600;
  `}
`;

// ============ BADGE ============
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  background-color: ${props => {
    if (props.variant === 'success') return '#E8F5E9';
    if (props.variant === 'error') return '#FFEBEE';
    if (props.variant === 'warning') return '#FFF3E0';
    if (props.variant === 'info') return '#E3F2FD';
    return '#F5F7FA';
  }};

  color: ${props => {
    if (props.variant === 'success') return '#00B849';
    if (props.variant === 'error') return '#D32F2F';
    if (props.variant === 'warning') return '#F57C00';
    if (props.variant === 'info') return '#1976D2';
    return '#5F6368';
  }};
`;

// ============ LOADER ============
export const LoadingSpinner = styled.div`
  display: inline-block;
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  border: 3px solid ${props => props.theme.colors?.border || '#DADCE0'};
  border-top-color: ${props => props.theme.colors?.primary || '#0066CC'};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// ============ DIVIDER ============
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors?.border || '#DADCE0'};
  margin: ${props => props.margin || '16px 0'};
`;

// ============ MODAL ============
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1040;
  padding: 16px;
  animation: fadeIn 200ms ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  background-color: ${props => props.theme.colors?.background || '#FFFFFF'};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows?.xl || '0 20px 25px rgba(0, 0, 0, 0.15)'};
  max-width: ${props => props.width || '500px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 300ms cubic-bezier(0.43, 0.13, 0.23, 0.96);

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// ============ EMPTY STATE ============
export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 16px;
  color: ${props => props.theme.colors?.text?.tertiary || '#9AA0A6'};

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    margin-bottom: 8px;
  }
`;

export default {
  Button,
  Card,
  Input,
  Label,
  FormGroup,
  ErrorText,
  Flex,
  Grid,
  Container,
  Heading,
  Paragraph,
  Badge,
  LoadingSpinner,
  Divider,
  Modal,
  ModalContent,
  EmptyState,
};
