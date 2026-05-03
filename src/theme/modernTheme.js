/**
 * Modern Professional Theme System
 * Production-grade design tokens for Nostalgia app
 */

const modernTheme = {
  // ============ COLORS ============
  colors: {
    // Primary brand colors
    primary: '#0066CC', // Professional blue
    primaryLight: '#E3F2FD',
    primaryDark: '#004499',
    
    // Secondary brand colors
    secondary: '#6200EA', // Purple accent
    secondaryLight: '#F3E5F5',
    secondaryDark: '#4800BB',
    
    // Accent colors
    success: '#00B849', // Green
    successLight: '#E8F5E9',
    error: '#D32F2F', // Red
    errorLight: '#FFEBEE',
    warning: '#F57C00', // Orange
    warningLight: '#FFF3E0',
    info: '#1976D2', // Blue
    infoLight: '#E3F2FD',
    
    // Neutral colors (grayscale)
    background: '#FFFFFF',
    surface: '#F5F7FA',
    surfaceAlt: '#ECECF0',
    text: {
      primary: '#1A1A1A',
      secondary: '#5F6368',
      tertiary: '#9AA0A6',
      disabled: '#BDBDBD',
    },
    border: '#DADCE0',
    borderLight: '#E8EAED',
    hover: '#F8F9FA',
    divider: '#E0E0E0',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.12)',
    
    // Glass morphism
    glass: 'rgba(255, 255, 255, 0.7)',
  },

  // ============ TYPOGRAPHY ============
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: 1.5,
    
    // Heading sizes
    h1: {
      fontSize: '32px',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '28px',
      fontWeight: '700',
      lineHeight: '1.3',
      letterSpacing: '-0.3px',
    },
    h3: {
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '1.3',
    },
    h4: {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.4',
    },
    h5: {
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '1.4',
    },
    h6: {
      fontSize: '14px',
      fontWeight: '600',
      lineHeight: '1.5',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    // Body text
    body1: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    body2: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.57',
    },
    body3: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.66',
    },
    
    // Special text
    button: {
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'none',
      letterSpacing: '0.3px',
    },
    caption: {
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '1.66',
    },
    overline: {
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  },

  // ============ SPACING ============
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    '3xl': '48px',
    '4xl': '64px',
  },

  // ============ SHADOWS ============
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    elevated: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },

  // ============ BORDER RADIUS ============
  borderRadius: {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  // ============ TRANSITIONS ============
  transitions: {
    // Duration
    duration: {
      fastest: '75ms',
      fast: '150ms',
      base: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    // Timing function
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      linear: 'linear',
      custom: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
    },
  },

  // ============ Z-INDEX ============
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    notification: 1070,
  },

  // ============ BREAKPOINTS ============
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px',
  },

  // ============ BUTTON STYLES ============
  buttons: {
    primary: {
      background: '#0066CC',
      color: '#FFFFFF',
      border: 'none',
      hover: {
        background: '#004499',
        shadow: '0 4px 12px rgba(0, 102, 204, 0.3)',
      },
      active: {
        background: '#003366',
      },
      disabled: {
        background: '#BDBDBD',
        color: '#9AA0A6',
        cursor: 'not-allowed',
      },
    },
    secondary: {
      background: '#FFFFFF',
      color: '#0066CC',
      border: '1px solid #0066CC',
      hover: {
        background: '#E3F2FD',
        shadow: '0 4px 12px rgba(0, 102, 204, 0.15)',
      },
      active: {
        background: '#BBDEFB',
      },
      disabled: {
        background: '#F5F5F5',
        color: '#BDBDBD',
        border: '1px solid #E0E0E0',
        cursor: 'not-allowed',
      },
    },
    danger: {
      background: '#D32F2F',
      color: '#FFFFFF',
      hover: {
        background: '#B71C1C',
      },
      disabled: {
        background: '#BDBDBD',
        color: '#9AA0A6',
      },
    },
  },

  // ============ INPUT STYLES ============
  inputs: {
    background: '#FFFFFF',
    border: '#DADCE0',
    borderFocus: '#0066CC',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    focus: {
      outline: 'none',
      borderColor: '#0066CC',
      boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.1)',
    },
    error: {
      borderColor: '#D32F2F',
      boxShadow: '0 0 0 3px rgba(211, 47, 47, 0.1)',
    },
    disabled: {
      background: '#F5F5F5',
      color: '#BDBDBD',
      cursor: 'not-allowed',
    },
  },

  // ============ CARD STYLES ============
  cards: {
    background: '#FFFFFF',
    border: '#E8EAED',
    borderRadius: '12px',
    padding: '16px',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    hover: {
      shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // ============ LAYOUT ============
  layout: {
    maxWidth: '1400px',
    gutter: '16px',
    sidebars: {
      width: '280px',
      widthCollapsed: '80px',
    },
    header: {
      height: '64px',
    },
  },
};

export default modernTheme;
