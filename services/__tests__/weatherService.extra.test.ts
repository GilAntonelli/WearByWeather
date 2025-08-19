/**
 * Extra tests for services/weatherService.ts
 * Scenarios: expired cache, missing API key (401), snow detection -> chuva=true
 */

import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// AsyncStorage mock (in-memory)
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// i18n language (so mapLanguageToOpenWeather -> 'pt')
jest.mock('i18next', () => ({ language: 'pt-PT' }));

// Stable timezone
jest.mock('tz-lookup', () => jest.fn(() => 'Europe/Lisbon'));

// By default, provide a valid API key via expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: { extra: { openWeatherApiKey: 'TEST_OPENWEATHER_KEY' } },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTime } from 'luxon';
import { getWeatherByCity } from '../weatherService';

// Helpers
const WEATHER_CACHE_TTL = 15 * 60 * 1000;

function mockGeoSuccess(lat = 38.7223, lon = -9.1393) {
  mockedAxios.get.mockResolvedValueOnce({
    data: [{ name: 'Lisboa', country: 'PT', state: 'Lisbon', lat, lon }],
  });
}

function mockWeatherSuccess({
  dt = 1710000000,
  temp = 20,
  feels_like = 21,
  temp_min = 18,
  temp_max = 22,
  humidity = 60,
  weatherId = 800, // clear
  main = 'Clear',
  description = 'clear sky',
  windSpeed = 3,
  rain1h,
  snow1h,
}: Partial<{
  dt: number;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  weatherId: number;
  main: string;
  description: string;
  windSpeed: number;
  rain1h: number;
  snow1h: number;
}> = {}) {
  const payload: any = {
    dt,
    main: { temp, feels_like, temp_min, temp_max, humidity },
    weather: [{ id: weatherId, main, description, icon: '01d' }],
    wind: { speed: windSpeed },
  };
  if (typeof rain1h === 'number') payload.rain = { '1h': rain1h };
  if (typeof snow1h === 'number') payload.snow = { '1h': snow1h };

  mockedAxios.get.mockResolvedValueOnce({ data: payload });
}

beforeEach(() => {
  jest.resetAllMocks(); // <-- reseta tb implementações .mockResolvedValueOnce, etc.
  (AsyncStorage as any).clear();
  jest.useRealTimers();
  jest.spyOn(Date, 'now').mockRestore();
});


describe('Expired cache causes a fresh network call', () => {
  it('ignores cache older than TTL and fetches again with new data', async () => {
    // 1) First call -> fills cache with temp=20
    mockGeoSuccess();
    mockWeatherSuccess({ temp: 20, feels_like: 20 });
    const first = await getWeatherByCity('Lisboa');
    expect(first.temperatura).toBe(20);

    // Record axios calls after first fetch
    const afterFirstCalls = mockedAxios.get.mock.calls.length;

    // 2) Advance time beyond TTL
    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now + WEATHER_CACHE_TTL + 1000);

    // 3) Second call should NOT use cache -> should call API again and return updated temp=27
    mockGeoSuccess();
    mockWeatherSuccess({ temp: 27, feels_like: 27 });

    const second = await getWeatherByCity('Lisboa');
    expect(second.temperatura).toBe(27);

    const afterSecondCalls = mockedAxios.get.mock.calls.length;
    expect(afterSecondCalls).toBeGreaterThan(afterFirstCalls); // new axios calls happened
  });
});

 describe('Unauthorized (401) from API', () => {
  it('propagates 401 when the weather API returns unauthorized', async () => {
    // Geocoding ok
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ name: 'Lisboa', country: 'PT', state: 'Lisbon', lat: 38.72, lon: -9.14 }],
    });
    // Weather call -> 401
    (axios.get as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } });

    await expect(getWeatherByCity('Lisboa')).rejects.toBeTruthy();
  });
});

describe('Snow detection without explicit snow["1h"] volume', () => {
  it('marks chuva=true when main=Snow and id=600, even if no snow volume field exists', async () => {
    mockGeoSuccess();
    // Simulate Snow but no snow["1h"]
    mockWeatherSuccess({
      weatherId: 600,          // Snow range
      main: 'Snow',
      description: 'snowing lightly',
      temp: -2,
      feels_like: -4,
      // ⚠️ no snow1h here on purpose
    });

    const result = await getWeatherByCity('Oslo');
    expect(result.chuva).toBe(true);   // must be true even without snow["1h"]
    expect(result.descricao).toBe('Snow');
    expect(result.condicao).toBe('snowing lightly');
  });
});
describe('Rain detection without explicit rain["1h"] volume', () => {
  it('marks chuva=true when main=Rain and id=500, even if no rain volume field exists', async () => {
    mockGeoSuccess();
    // Simulate Rain but no rain["1h"]
    mockWeatherSuccess({
      weatherId: 500,          // Rain range
      main: 'Rain',
      description: 'light rain without volume',
      temp: 15,
      feels_like: 14,
      // ⚠️ no rain1h here on purpose
    });

    const result = await getWeatherByCity('Lisboa');
    expect(result.chuva).toBe(true);   // must be true even without rain["1h"]
    expect(result.descricao).toBe('Rain');
    expect(result.condicao).toBe('light rain without volume');
  });
});

describe('Snow detection sets chuva=true', () => {
  it('marks chuva=true when snow volume is present, even if main says Snow', async () => {
    mockGeoSuccess();
    // weatherId in Snow range (e.g., 600), main=Snow, and snow 1h positive
    mockWeatherSuccess({
      weatherId: 600,
      main: 'Snow',
      description: 'light snow',
      snow1h: 0.7,
      temp: -1,
      feels_like: -3,
    });

    const result = await getWeatherByCity('Lisboa');
    expect(result.chuva).toBe(true); // true for precipitation (rain OR snow)
    expect(result.descricao).toBe('Snow');
    expect(result.condicao).toBe('light snow');
  });
});
