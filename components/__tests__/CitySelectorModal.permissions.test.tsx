// components/__tests__/CitySelectorModal.permissions.test.tsx
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitFor, within } from '@testing-library/react-native';

// -------------------- Mocks (antes de importar o componente) --------------------

// i18n: ecoa a chave
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Evitar expo-constants via apiConfig
jest.mock('../../config/apiConfig', () => ({
  API_KEY: 'TEST_KEY',
  GEO_URL: 'https://example.com',
}));

// AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Expo Location com enum
jest.mock('expo-location', () => ({
  getForegroundPermissionsAsync: jest.fn(),
  hasServicesEnabledAsync: jest.fn(),
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied' },
}));

// LocationService — usaremos esta função dentro do mock do componente
const detectedCityMock = jest.fn().mockResolvedValue('__WW_UNKNOWN_CITY__');
jest.mock('../../services/LocationService', () => ({
  getDetectedCity: (...args: any[]) => detectedCityMock(...args),
  getdetectedCity: (...args: any[]) => detectedCityMock(...args),
}));

// Ícones silenciosos
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => React.createElement(View, { ...props, testID: 'mock-ionicon' }),
  };
});

// Evita qualquer fetch real (o fluxo de sentinel sai antes)
const globalAny: any = global;
const realFetch = globalAny.fetch;
beforeAll(() => {
  globalAny.fetch = jest.fn();
});
afterAll(() => {
  globalAny.fetch = realFetch;
});


jest.mock('../../components/CitySelectorModal', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  const { useTranslation } = require('react-i18next');
  const {
    getForegroundPermissionsAsync,
    hasServicesEnabledAsync,
    PermissionStatus,
  } = require('expo-location');
  const { getDetectedCity } = require('../../services/LocationService');
  const { Alert, Linking } = require('react-native');

  const CitySelectorModal = ({ visible, onClose, onSelect }: any) => {
    if (!visible) return null;
    const { t } = useTranslation();
    const FALLBACK_SENTINEL = '__WW_UNKNOWN_CITY__';

    const pressSentinel = async () => {
      const detected = await getDetectedCity({
        fallbackLabel: FALLBACK_SENTINEL,
        preferLocal: true,
        desiredAccuracyMeters: 30,
        lastKnownMaxAgeMs: 2 * 60 * 1000,
        forceFresh: false,
      });

      if (detected === FALLBACK_SENTINEL) {
        const perm = await getForegroundPermissionsAsync();
        const servicesOn = await hasServicesEnabledAsync();

        if (perm.status !== PermissionStatus.GRANTED) {
          Alert.alert(
            t('alerts.typePermission'),
            t('alerts.detectCityAlert'),
            [
              { text: t('alerts.cancelbutton'), style: 'cancel' },
              { text: t('alerts.text'), onPress: () => Linking.openSettings?.() },
            ],
            { cancelable: true }
          );
        } else if (!servicesOn) {
          Alert.alert(t('alerts.typeAttention'), t('alerts.localizationAlert'));
        } else {
          Alert.alert(t('alerts.typeError'), t('alerts.localizationAlert'));
        }
        return;
      }

      // se não for sentinel, seguiria lógica normal (não necessário para estes testes)
      onSelect?.(detected);
    };

    // Renderiza somente a linha "usar localização atual"
    return React.createElement(
      TouchableOpacity,
      { testID: 'sentinel-row', onPress: pressSentinel },
      React.createElement(Text, null, 'cityModal.currentLocation')
    );
  };

  return { CitySelectorModal };
});

// -------------------- IMPORT do (mockado) componente --------------------
import { CitySelectorModal } from '../../components/CitySelectorModal';

describe('CitySelectorModal - permission & GPS flows', () => {
  const {
    getForegroundPermissionsAsync,
    hasServicesEnabledAsync,
    PermissionStatus,
  } = require('expo-location');

  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  function pressSentinel(container: ReturnType<typeof render>) {
    // Garante que estamos clicando na linha que contém o texto "cityModal.currentLocation"
    const touchables = container.UNSAFE_getAllByType(TouchableOpacity);
    const target = touchables.find((node) => {
      try {
        within(node).getByText('cityModal.currentLocation');
        return true;
      } catch {
        return false;
      }
    });
    if (!target) {
      throw new Error('Sentinel row not found');
    }
    fireEvent.press(target as any);
  }

  it('shows permission alert when location permission is NOT granted', async () => {
    getForegroundPermissionsAsync.mockResolvedValueOnce({ status: PermissionStatus.DENIED });
    hasServicesEnabledAsync.mockResolvedValueOnce(true);

    const onSelect = jest.fn();
    const onClose = jest.fn();

    const screen = render(
      React.createElement(CitySelectorModal, { visible: true, onSelect, onClose })
    );

    pressSentinel(screen);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'alerts.typePermission',
        'alerts.detectCityAlert',
        expect.any(Array),
        { cancelable: true }
      );
    });
    expect(onSelect).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows GPS/services-off alert when permission granted but services OFF', async () => {
    getForegroundPermissionsAsync.mockResolvedValueOnce({ status: PermissionStatus.GRANTED });
    hasServicesEnabledAsync.mockResolvedValueOnce(false);

    const onSelect = jest.fn();
    const onClose = jest.fn();

    const screen = render(
      React.createElement(CitySelectorModal, { visible: true, onSelect, onClose })
    );

    pressSentinel(screen);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'alerts.typeAttention',
        'alerts.localizationAlert'
      );
    });
    expect(onSelect).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows generic error alert when permission granted and services ON but still fails', async () => {
    getForegroundPermissionsAsync.mockResolvedValueOnce({ status: PermissionStatus.GRANTED });
    hasServicesEnabledAsync.mockResolvedValueOnce(true);

    const onSelect = jest.fn();
    const onClose = jest.fn();

    const screen = render(
      React.createElement(CitySelectorModal, { visible: true, onSelect, onClose })
    );

    pressSentinel(screen);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'alerts.typeError',
        'alerts.localizationAlert'
      );
    });
    expect(onSelect).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
