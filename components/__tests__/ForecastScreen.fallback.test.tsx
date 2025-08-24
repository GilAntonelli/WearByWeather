// components/__tests__/ForecastScreen.fallback.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Router mock
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), replace: jest.fn() }),
}));

// i18n mock
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Safe-area mock para não desmontar a árvore nos testes
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    SafeAreaProvider: ({ children }: any) => React.createElement(View, null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Ícones mock (evita “type is invalid” ao renderizar)
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Feather: (props: any) => React.createElement(View, { ...props, testID: 'mock-feather' }),
    Ionicons: (props: any) => React.createElement(View, { ...props, testID: 'mock-ionicons' }),
  };
});

// Stubs de componentes pesados — foca só no fluxo do modal
jest.mock('../../components/ForecastHeader', () => () => null);
jest.mock('../../components/WeatherDetailCard', () => () => null);
jest.mock('../../components/HourlyForecastCard', () => () => null);

// Constants para evitar warnings do expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: { extra: { openWeatherApiKey: 'TEST_KEY' } },
}));

// Mock do CitySelectorModal (export default + named) — sem JSX no factory
jest.mock('../../components/CitySelectorModal', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  const CitySelectorModal = ({ visible, onSelect }: any) => {
    if (!visible) return null;
    return React.createElement(
      TouchableOpacity,
      {
        testID: 'city-select-ok',
        onPress: () => onSelect({ name: 'Lisboa', state: 'Lisbon', country: 'PT' }),
      },
      React.createElement(Text, null, 'select'),
    );
  };
  return { __esModule: true, default: CitySelectorModal, CitySelectorModal };
});

// Mock do storage SEM capturar variável de fora do factory
jest.mock('../../services/cityStorage', () => ({
  resolveInitialCity: jest.fn(),
  saveCity: jest.fn().mockResolvedValue(undefined),
}));

// Services de weather/prefetch
jest.mock('../../services/weatherService', () => ({
  getWeatherByCity: jest.fn().mockResolvedValue({
    temperatura: 24,
    condicao: 'Clear',
    descricao: 'clear sky',
    id: 800,
    icon: '01d',
    localTime: '12:00',
    tempMax: 26,
    tempMin: 20,
    chuva: false,
    vento: 10,
    umidade: 50,
  }),
  getHourlyForecastByCity: jest.fn().mockResolvedValue([
    { hora: '13:00', temperatura: 24, icon: '01d' },
  ]),
}));

jest.mock('../../services/homePrefetch', () => ({
  prefetchHomeData: jest.fn().mockResolvedValue(undefined),
}));

// AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// === Importar a screen DEPOIS dos mocks ===
import ForecastScreen from '../../app/forecast';
import { getWeatherByCity, getHourlyForecastByCity } from '../../services/weatherService';
import { prefetchHomeData } from '../../services/homePrefetch';

// Pega os handles dos mocks para configurar no beforeEach
const { resolveInitialCity } = require('../../services/cityStorage');

describe('ForecastScreen - fallback opens modal and selection loads data', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configura TODAS as chamadas esperadas do resolveInitialCity:
    // 1ª e 2ª → fallback (abre modal)
    // 3ª em diante → saved (após seleção)
    resolveInitialCity
      .mockResolvedValueOnce({ raw: 'Lisbon', label: 'Lisboa', source: 'fallback' })
      .mockResolvedValueOnce({ raw: 'Lisbon', label: 'Lisboa', source: 'fallback' })
      .mockResolvedValue({ raw: 'Lisbon', label: 'Lisboa', source: 'saved' });
  });

  it('opens modal on fallback and does not fetch until user selects a city', async () => {
    const { queryByTestId, getByTestId } = render(React.createElement(ForecastScreen));

    // Espera o modal ficar visível usando queryBy* dentro do waitFor (evita throws durante o polling)
    await waitFor(() => {
      expect(queryByTestId('city-select-ok')).toBeTruthy();
    });

    // Nada foi buscado ainda
    expect(getWeatherByCity).not.toHaveBeenCalled();
    expect(getHourlyForecastByCity).not.toHaveBeenCalled();

    // Seleciona a cidade no modal
    const btn = getByTestId('city-select-ok');
    fireEvent.press(btn);

    // Agora deve buscar clima/previsão e fechar o modal
    await waitFor(() => {
      expect(getWeatherByCity).toHaveBeenCalledWith('Lisbon');
      expect(getHourlyForecastByCity).toHaveBeenCalledWith('Lisbon');
      expect(prefetchHomeData).toHaveBeenCalled();
      expect(queryByTestId('city-select-ok')).toBeNull();
    });
  });
});
