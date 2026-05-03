import { createGlobalStyle } from 'styled-components';

const ModernGlobalStyle = createGlobalStyle`
  /* ============ RESET & BASE ============ */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily || '"Segoe UI", Roboto, "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif'};
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: ${props => props.theme.colors?.text?.primary || '#1A1A1A'};
    background-color: ${props => props.theme.colors?.background || '#FFFFFF'};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ============ TYPOGRAPHY ============ */
  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.colors?.text?.primary || '#1A1A1A'};
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 12px;
    letter-spacing: -0.2px;
  }

  h1 { font-size: 32px; }
  h2 { font-size: 28px; }
  h3 { font-size: 24px; }
  h4 { font-size: 20px; font-weight: 600; }
  h5 { font-size: 16px; font-weight: 600; }
  h6 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

  p {
    color: ${props => props.theme.colors?.text?.primary || '#1A1A1A'};
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: ${props => props.theme.colors?.primary || '#0066CC'};
    text-decoration: none;
    transition: color 200ms ease-in-out;

    &:hover {
      color: ${props => props.theme.colors?.primaryDark || '#004499'};
      text-decoration: underline;
    }

    &:active {
      color: ${props => props.theme.colors?.primary || '#0066CC'};
    }
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  /* ============ FORM ELEMENTS ============ */
  input, textarea, select {
    font-family: inherit;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme.colors?.border || '#DADCE0'};
    padding: 12px 16px;
    background-color: ${props => props.theme.colors?.background || '#FFFFFF'};
    color: ${props => props.theme.colors?.text?.primary || '#1A1A1A'};
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

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

    &::placeholder {
      color: ${props => props.theme.colors?.text?.tertiary || '#9AA0A6'};
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  button {
    font-family: inherit;
    font-weight: 600;
    cursor: pointer;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px;
    transition: all 200ms ease-in-out;
    text-transform: none;
    letter-spacing: 0.3px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  }

  /* ============ BUTTONS ============ */
  .btn-primary {
    background-color: ${props => props.theme.colors?.primary || '#0066CC'};
    color: white;

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors?.primaryDark || '#004499'};
      box-shadow: ${props => props.theme.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
    }
  }

  .btn-secondary {
    background-color: transparent;
    color: ${props => props.theme.colors?.primary || '#0066CC'};
    border: 1px solid ${props => props.theme.colors?.primary || '#0066CC'};

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors?.primaryLight || '#E3F2FD'};
      box-shadow: ${props => props.theme.shadows?.sm || '0 1px 3px rgba(0, 0, 0, 0.1)'};
    }
  }

  .btn-danger {
    background-color: ${props => props.theme.colors?.error || '#D32F2F'};
    color: white;

    &:hover:not(:disabled) {
      background-color: #B71C1C;
      box-shadow: ${props => props.theme.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
    }
  }

  .btn-success {
    background-color: ${props => props.theme.colors?.success || '#00B849'};
    color: white;

    &:hover:not(:disabled) {
      background-color: #009938;
      box-shadow: ${props => props.theme.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'};
    }
  }

  /* ============ SCROLLBAR ============ */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors?.surface || '#F5F7FA'};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors?.border || '#DADCE0'};
    border-radius: 4px;
    transition: background 200ms ease;

    &:hover {
      background: ${props => props.theme.colors?.text?.tertiary || '#9AA0A6'};
    }
  }

  /* ============ SELECTION ============ */
  ::selection {
    background-color: ${props => props.theme.colors?.primary || '#0066CC'};
    color: white;
  }

  ::-moz-selection {
    background-color: ${props => props.theme.colors?.primary || '#0066CC'};
    color: white;
  }

  /* ============ UTILITIES ============ */
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .text-center {
    text-align: center;
  }

  .text-muted {
    color: ${props => props.theme.colors?.text?.tertiary || '#9AA0A6'};
  }

  .text-error {
    color: ${props => props.theme.colors?.error || '#D32F2F'};
  }

  .text-success {
    color: ${props => props.theme.colors?.success || '#00B849'};
  }

  .text-warning {
    color: ${props => props.theme.colors?.warning || '#F57C00'};
  }

  .text-info {
    color: ${props => props.theme.colors?.info || '#1976D2'};
  }

  /* ============ LOADING ANIMATION ============ */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* ============ RESPONSIVE ============ */
  @media (max-width: 768px) {
    h1 { font-size: 28px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    h4 { font-size: 18px; }
    h5 { font-size: 16px; }
    h6 { font-size: 12px; }

    input, textarea, select, button {
      font-size: 16px; /* Prevents zoom on iOS */
    }

    .container {
      padding: 0 12px;
    }
  }

  @media (max-width: 480px) {
    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
    h3 { font-size: 18px; }

    body {
      font-size: 13px;
    }
  }
`;

export default ModernGlobalStyle;
