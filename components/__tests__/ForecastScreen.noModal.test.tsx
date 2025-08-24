// components/__tests__/ForecastScreen.noModal.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

// Router
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), replace: jest.fn() }),
}));

// i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// safe-area (evita desmontes e elementos nativos)
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    SafeAreaProvider: ({ children }: any) => React.createElement(View, null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// ícones (evita “Element type is invalid”)
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Feather: (props: any) => React.createElement(View, { ...props, testID: 'mock-feather' }),
    Ionicons: (props: any) => React.createElement(View, { ...props, testID: 'mock-ionicons' }),
  };
});

// stubs de componentes pesados
jest.mock('../../components/ForecastHeader', () => () => null);
jest.mock('../../components/WeatherDetailCard', () => () => null);
jest.mock('../../components/HourlyForecastCard', () => () => null);

// expo-constants para apiConfig
jest.mock('expo-constants', () => ({
  expoConfig: { extra: { openWeatherApiKey: 'TEST_KEY' } },
}));

// CitySelectorModal — precisa export default TAMBÉM
jest.mock('../../components/CitySelectorModal', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  const CitySelectorModal = ({ visible, onSelect }: any) => {
    if (!visible) return null;
    // só apareceria se a tela pedisse o modal, o que aqui NÃO deve acontecer
    return React.createElement(
      TouchableOpacity,
      { testID: 'city-select-ok', onPress: () => onSelect({ name: 'Berlin' }) },
      React.createElement(Text, null, 'select')
    );
  };
  return { __esModule: true, default: CitySelectorModal, CitySelectorModal };
});

// storage -> caminho saved/detected (sem variável fora do factory)
jest.mock('../../services/cityStorage', () => ({
  resolveInitialCity: jest.fn().mockResolvedValue({
    raw: 'Berlin',
    label: 'Berlin',
    source: 'saved',
  }),
  saveCity: jest.fn().mockResolvedValue(undefined),
}));

// serviços de clima
jest.mock('../../services/weatherService', () => ({
  getWeatherByCity: jest.fn().mockResolvedValue({
    temperatura: 18,
    condicao: 'Clouds',
    descricao: 'few clouds',
    id: 801,
    icon: '02d',
    localTime: '09:00',
    tempMax: 20,
    tempMin: 15,
    chuva: false,
    vento: 8,
    umidade: 60,
  }),
  getHourlyForecastByCity: jest.fn().mockResolvedValue([
    { hora: '10:00', temperatura: 18, icon: '02d' },
  ]),
}));

jest.mock('../../services/homePrefetch', () => ({
  prefetchHomeData: jest.fn().mockResolvedValue(undefined),
}));

// AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// === importar a tela depois dos mocks ===
import ForecastScreen from '../../app/forecast';
import { getWeatherByCity, getHourlyForecastByCity } from '../../services/weatherService';

describe('ForecastScreen - saved/detected path', () => {
  beforeEach(() => jest.clearAllMocks());

  it('does not open modal and fetches weather immediately', async () => {
    const { queryByTestId } = render(React.createElement(ForecastScreen));

    // o modal não deve abrir nesse fluxo
    expect(queryByTestId('city-select-ok')).toBeNull();

    // deve buscar clima já com a cidade salva/detectada
    await waitFor(() => {
      expect(getWeatherByCity).toHaveBeenCalledWith('Berlin');
      expect(getHourlyForecastByCity).toHaveBeenCalledWith('Berlin');
    });
  });
});
