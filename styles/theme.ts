export const theme = {
  colors: {
    primary: '#FFD700',
    background: '#F6F6F6',

    // Adicionada compatibilidade
    text: '#333333', // mesmo valor de textDark
    textDark: '#333333',
    textLight: '#999999',
    textMedium: '#666666',
    white: '#FFFFFF',

    // Cores auxiliares
    border: '#CCCCCC',
    disabled: '#E0E0E0',
    focusOutline: '#FFD700',
    shadow: '#00000022',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  radius: {
    sm: 8,
    md: 16,
    full: 999,
  },

  fontSize: {
    small: 14,
    medium: 16,
    large: 25,
    extralarge: 35,
    title: 28,
  },

  fontWeight: {
    regular: '400',
    bold: '700',
  },

  elevation: {
    light: 2,
    medium: 4,
    strong: 8,
  },

  opacity: {
    low: 0.4,
    medium: 0.7,
    high: 1,
  },
};
