import styled from 'styled-components';
import React from 'react';

export const Button = styled.button`
  padding: ${props => {
    if (props.size === 'large') return `${props.theme.spacing[3]} ${props.theme.spacing[6]}`;
    if (props.size === 'small') return `${props.theme.spacing[1]} ${props.theme.spacing[3]}`;
    return `${props.theme.spacing[2.5]} ${props.theme.spacing[4]}`;
  }};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  font-family: inherit;
  position: relative;
  overflow: hidden;
  
  background-color: ${props => {
    if (props.variant === 'secondary') return props.theme.colors.secondary;
    if (props.variant === 'success') return props.theme.colors.success;
    if (props.variant === 'error') return props.theme.colors.error;
    if (props.variant === 'warning') return props.theme.colors.warning;
    if (props.variant === 'outline') return 'transparent';
    return props.theme.colors.primary;
  }};
  
  color: ${props => 
    props.variant === 'outline' 
      ? props.theme.colors.primary 
      : '#FFFFFF'
  };
  
  border: ${props => 
    props.variant === 'outline'
      ? `2px solid ${props.theme.colors.primary}`
      : 'none'
  };

  box-shadow: ${props => 
    props.variant === 'outline' 
      ? 'none'
      : props.theme.shadows.sm
  };

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
    background-color: ${props => {
      if (props.variant === 'secondary') return props.theme.colors.secondaryDark;
      if (props.variant === 'success') return '#059669';
      if (props.variant === 'error') return '#DC2626';
      if (props.variant === 'warning') return '#D97706';
      if (props.variant === 'outline') return props.theme.colors.primaryLight;
      return props.theme.colors.primaryDark;
    }};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => props.fullWidth && 'width: 100%;'}
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing[4]};
`;

const Label = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing[2]};
  display: block;
`;

const FormInput = styled.input`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all ${props => props.theme.transitions.fast};
  font-family: inherit;
  background-color: ${props => props.theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLighter};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    color: ${props => props.theme.colors.textLighter};
  }

  ${props => props.error && `
    border-color: ${props.theme.colors.error};
    &:focus {
      box-shadow: 0 0 0 4px ${props.theme.colors.error}20;
    }
  `}
`;

const ErrorMessage = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing[1]};
  display: block;
`;

// FormInput Component
const FormInputComponent = ({ label, error, ...props }) => (
  <FormGroup>
    {label && <Label>{label}</Label>}
    <FormInput {...props} error={error} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </FormGroup>
);

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`;

// Add Input as a child component
Form.Input = FormInputComponent;

export const Input = styled.input`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all ${props => props.theme.transitions.fast};
  font-family: inherit;
  background-color: ${props => props.theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLighter};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    color: ${props => props.theme.colors.textLighter};
  }
`;

const CardBody = styled.div`
  padding: ${props => props.theme.spacing[6]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[4]};
  }
`;

export const Card = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all ${props => props.theme.transitions.base};
  border: 1px solid ${props => props.theme.colors.borderLight};

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

// Add Body as a child component
Card.Body = CardBody;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  width: 100%;
`;

export const Text = styled.p`
  font-size: ${props => props.size || props.theme.typography.fontSize.base};
  color: ${props => props.color || props.theme.colors.text};
  font-weight: ${props => props.weight || props.theme.typography.fontWeight.normal};
  line-height: ${props => props.lineHeight || 1.6};
  margin: ${props => props.margin || 0};
`;

export const Heading = styled.h1`
  font-size: ${props => {
    switch(props.level) {
      case 1: return props.theme.typography.fontSize['4xl'];
      case 2: return props.theme.typography.fontSize['3xl'];
      case 3: return props.theme.typography.fontSize['2xl'];
      case 4: return props.theme.typography.fontSize.xl;
      default: return props.theme.typography.fontSize['4xl'];
    }
  }};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.color || props.theme.colors.text};
  margin: ${props => props.margin || `${props.theme.spacing[4]} 0`};
`;

export const Flex = styled.div`
  display: flex;
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'center'};
  gap: ${props => props.gap || props.theme.spacing[4]};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  width: ${props => props.width || 'auto'};
`;

export const Textarea = styled.textarea`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-family: ${props => props.theme.typography.fontFamily};
  resize: vertical;
  transition: all ${props => props.theme.transitions.fast};
  background-color: ${props => props.theme.colors.surface};
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLighter};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    color: ${props => props.theme.colors.textLighter};
  }
`;

export const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: ${props => props.gap || props.theme.spacing[6]};
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing[4]};

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[2]};
    gap: ${props => props.theme.spacing[4]};
  }
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
  position: sticky;
  top: ${props => props.theme.spacing[4]};
  height: fit-content;
  max-height: calc(100vh - ${props => props.theme.spacing[8]});
  overflow-y: auto;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.full};

    &:hover {
      background: ${props => props.theme.colors.textLight};
    }
  }
`;

export const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
  min-height: 100vh;
  width: 100%;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: ${props => props.theme.spacing[3]};
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.primary};
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[12]};
  text-align: center;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 2px dashed ${props => props.theme.colors.border};

  h3 {
    font-size: ${props => props.theme.typography.fontSize.lg};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing[2]};
  }

  p {
    color: ${props => props.theme.colors.textLight};
    margin-bottom: ${props => props.theme.spacing[4]};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(250px, 1fr))'};
  gap: ${props => props.gap || props.theme.spacing[4]};
  width: 100%;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  background-color: ${props => props.bg || props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.full};
  white-space: nowrap;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin: ${props => props.margin || `${props.theme.spacing[4]} 0`};
  width: 100%;
`;
