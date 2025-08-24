// components/__tests__/cityStorage.test.ts
import { resolveInitialCity, saveCity } from '../../services/cityStorage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../../services/LocationService', () => ({
  getDetectedCity: jest.fn(),
}));

const { getDetectedCity } = require('../../services/LocationService');

describe('cityStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns saved JSON city when present', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem(
      'lastCity',
      JSON.stringify({ raw: 'Lisbon', label: 'Lisboa' })
    );

    const result = await resolveInitialCity({ preferDetection: true });
    expect(result).toEqual({ raw: 'Lisbon', label: 'Lisboa', source: 'saved' });
  });

  test('returns saved string city when present (legacy format)', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem('lastCity', 'Madrid');

    const result = await resolveInitialCity({ preferDetection: true });
    expect(result).toEqual({ raw: 'Madrid', label: 'Madrid', source: 'saved' });
  });

  test('returns detected city when no saved and detection succeeds', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    (AsyncStorage as any).clear();

    (getDetectedCity as jest.Mock).mockResolvedValueOnce('Berlin');

    const result = await resolveInitialCity({ preferDetection: true });
    expect(result).toEqual({ raw: 'Berlin', label: 'Berlin', source: 'detected' });
  });

  test('returns fallback when no saved and detection fails', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    (AsyncStorage as any).clear();

    (getDetectedCity as jest.Mock).mockRejectedValueOnce(new Error('no gps'));

    const result = await resolveInitialCity({
      preferDetection: true,
      fallback: { raw: 'Paris', label: 'Paris' },
    });
    expect(result).toEqual({ raw: 'Paris', label: 'Paris', source: 'fallback' });
  });

  test('saveCity persists JSON {raw,label}', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    await saveCity('Rome', 'Roma');

    const raw = await AsyncStorage.getItem('lastCity');
    expect(raw).toBe(JSON.stringify({ raw: 'Rome', label: 'Roma' }));
  });
});
