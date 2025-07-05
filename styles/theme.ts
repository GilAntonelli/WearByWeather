import { RFValue } from 'react-native-responsive-fontsize';

type WeatherBackgroundKeys =
  | 'clear'
  | 'partlyCloudy'
  | 'scattered'
  | 'cloudy'
  | 'lightRain'
  | 'rain'
  | 'heavyRain'
  | 'storm'
  | 'snow'
  | 'mist';

type Theme = {
  colors: {
    primary: string;
    forecastBackground: string;
    background: string;
    text: string;
    textDark: string;
    textLight: string;
    textMedium: string;
    white: string;
    border: string;
    disabled: string;
    focusOutline: string;
    shadow: string;
    
    weatherBackgrounds: Record<WeatherBackgroundKeys, string>;
  };
};


export const theme = {
  colors: {
    primary: '#FFD700',
    //   primaryLight: '#F1F5FE', // <-- adicionado aqui
    forecastBackground: '#A4D4FF',

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
  small: 13,                   // fixo
  medium: 15,                  // fixo
  large: 22,                   // fixo
  extralarge: RFValue(34),     // responsivo (p/ títulos maiores)
  title: RFValue(28),          // responsivo (p/ grandes destaques)
  icon: 22,                    // fixo (ideal para cards)
  cardText: 14,                // fixo (para texto dentro de botão/card)
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

  weatherBackgrounds: {
    clear: '#A4D4FF',
    partlyCloudy: '#C3D9F3',
    scattered: '#D6E0EB',
    cloudy: '#BFC8D1',
    lightRain: '#A1BBD4',
    rain: '#7FA1BF',
    heavyRain: '#5F7C99',
    storm: '#495866',
    snow: '#E0F7FA',
    mist: '#E8ECEF',
  },



};
