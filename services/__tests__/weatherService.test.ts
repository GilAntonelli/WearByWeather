/**
 * Tests for services/weatherService.ts
 * Covers: happy path, caching, city not found, forecast, empty list, timeouts, and city search.
 */

import axios from 'axios';

// ---- Mocks ----
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// AsyncStorage in-memory mock (official RN AsyncStorage mock)
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// i18n language used by the service (pt-PT → mapped to 'pt')
jest.mock('i18next', () => ({ language: 'pt-PT' }));

// Stable timezone for tests
jest.mock('tz-lookup', () => jest.fn(() => 'Europe/Lisbon'));

// Expo Constants to provide API key via app.config.js extra
jest.mock('expo-constants', () => ({
    expoConfig: { extra: { openWeatherApiKey: 'TEST_OPENWEATHER_KEY' } },
}));

// Import after mocks so modules use the mocked deps
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTime } from 'luxon';
import {
    getWeatherByCity,
    getHourlyForecastByCity,
    searchCitiesByName,
} from '../weatherService';

// Utility to reset mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage as any).clear(); // clear the in-memory store
});

// Helpers to build mock responses
function mockGeoSuccess(lat = -23.55, lon = -46.63) {
    mockedAxios.get.mockResolvedValueOnce({
        data: [{ name: 'Lisboa', lat, lon, country: 'PT', state: 'Lisbon' }],
    });
}

function mockWeatherSuccess({
    dt = 1710000000,
    temp = 20,
    feels_like = 21,
    temp_min = 18,
    temp_max = 22,
    humidity = 60,
    weatherId = 500, // Rain
    main = 'Rain',
    description = 'light rain',
    windSpeed = 3, // m/s
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
}> = {}) {
    mockedAxios.get.mockResolvedValueOnce({
        data: {
            dt,
            main: { temp, feels_like, temp_min, temp_max, humidity },
            weather: [{ id: weatherId, main, description, icon: '10d' }],
            wind: { speed: windSpeed },
            // rain/snow fields optional
        },
    });
}

function mockForecast3hBlocks(blocks: Array<{ dt: number; temp: number; icon?: string; desc?: string }>) {
    mockedAxios.get.mockResolvedValueOnce({
        data: {
            list: blocks.map((b) => ({
                dt: b.dt,
                main: { temp: b.temp },
                weather: [{ icon: b.icon ?? '01d', description: b.desc ?? 'clear sky' }],
            })),
        },
    });
}

describe('getWeatherByCity', () => {
    test('returns formatted weather on success (and computes rain + wind km/h)', async () => {
        // 1) Geocoding
        mockGeoSuccess(38.7223, -9.1393);
        // 2) Current weather
        mockWeatherSuccess({
            temp: 20,
            feels_like: 21,
            temp_min: 18,
            temp_max: 22,
            humidity: 60,
            weatherId: 500, // Rain id range
            main: 'Rain',
            description: 'light rain',
            windSpeed: 5, // m/s
        });

        const result = await getWeatherByCity('Lisboa');

        expect(result).toBeTruthy();
        expect(result.temperatura).toBe(20);
        expect(result.sensacaoTermica).toBe(21);
        expect(result.tempMin).toBe(18);
        expect(result.tempMax).toBe(22);
        expect(result.umidade).toBe(60);
        expect(result.chuva).toBe(true); // derived from weatherId/main
        expect(result.vento).toBe(Math.round(5 * 3.6)); // km/h conversion
        expect(result.descricao).toBe('Rain');
        expect(result.condicao).toBe('light rain');
        expect(result.icon).toBe('10d');
        expect(result.iconUrl).toContain('10d@2x.png');
        expect(result.id).toBe(500);
        // language mapped from i18next mock 'pt-PT' -> 'pt'
        expect(result.idioma).toBe('pt');
        expect(result.timezone).toBe('Europe/Lisbon');
        // localTime is time-formatted; we just assert it's a string "HH:mm"
        expect(result.localTime).toMatch(/^\d{2}:\d{2}$/);
    });

    test('uses cache when entry is fresh (no extra network calls on second read)', async () => {
        // First call: populate cache
        mockGeoSuccess(38.7223, -9.1393);
        mockWeatherSuccess({ temp: 25, feels_like: 25 });

        const first = await getWeatherByCity('Lisboa');
        expect(first.temperatura).toBe(25);

        // Second call immediately: should hit cache (no more axios.get calls)
        const axiosCallsBefore = mockedAxios.get.mock.calls.length;

        const second = await getWeatherByCity('Lisboa');
        expect(second.temperatura).toBe(25);

        const axiosCallsAfter = mockedAxios.get.mock.calls.length;
        expect(axiosCallsAfter).toBe(axiosCallsBefore); // no new calls
    });

    test('throws "Cidade não encontrada" when geocoding returns empty array', async () => {
        // Geocoding returns []
        mockedAxios.get.mockResolvedValueOnce({ data: [] });

        await expect(getWeatherByCity('Atlantis')).rejects.toThrow('Cidade não encontrada');
    });

    test('propagates timeout/network error from axios (ECONNABORTED)', async () => {
        mockGeoSuccess(38.7223, -9.1393);
        mockedAxios.get.mockRejectedValueOnce({ code: 'ECONNABORTED' });

        await expect(getWeatherByCity('Lisboa')).rejects.toBeTruthy();
    });
});

describe('getHourlyForecastByCity', () => {
    test('returns up to 9 forecast entries of 3h each (free plan)', async () => {
        // Geocoding for forecast
        mockGeoSuccess(38.7223, -9.1393);

        // Build 4 blocks (3h apart) starting now rounded to the hour
        const nowUtc = DateTime.utc();
        const base = nowUtc.minus({ minutes: nowUtc.minute, seconds: nowUtc.second, milliseconds: nowUtc.millisecond });
        const blocks = [0, 3, 6, 9].map((h) => ({
            dt: base.plus({ hours: h }).toSeconds(),
            temp: 19 + h, // arbitrary
        }));

        mockForecast3hBlocks(blocks);

        const list = await getHourlyForecastByCity('Lisboa');
        expect(Array.isArray(list)).toBe(true);
        expect(list.length).toBe(4);
        expect(list[0]).toHaveProperty('hora');
        expect(list[0]).toHaveProperty('temperatura');
        expect(list[0]).toHaveProperty('condicao');
        expect(list[0]).toHaveProperty('icon');
        expect(list[0]).toHaveProperty('iconUrl');
    });

    test('returns [] when API list is empty', async () => {
        mockGeoSuccess(38.7223, -9.1393);
        mockedAxios.get.mockResolvedValueOnce({ data: { list: [] } });

        const list = await getHourlyForecastByCity('Lisboa');
        expect(list).toEqual([]);
    });

    test('propagates error on timeout in forecast', async () => {
        mockGeoSuccess(38.7223, -9.1393);
        mockedAxios.get.mockRejectedValueOnce({ code: 'ECONNABORTED' });

        await expect(getHourlyForecastByCity('Lisboa')).rejects.toBeTruthy();
    });
});

describe('searchCitiesByName', () => {
    test('returns normalized entries (name, country, state, lat, lon)', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                { name: 'Goiania', country: 'BR', state: 'Goiás', lat: -16.67, lon: -49.25 },
                { name: 'Lisboa', country: 'PT', state: 'Lisbon', lat: 38.72, lon: -9.14 },
            ],
        });

        const results = await searchCitiesByName('lis');
        expect(results).toHaveLength(2);
        expect(results[0]).toEqual(
            expect.objectContaining({
                name: expect.any(String),
                country: expect.any(String),
                state: expect.any(String),
                lat: expect.any(Number),
                lon: expect.any(Number),
            })
        );
    });

    test('returns [] on network error', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('network down'));
        const results = await searchCitiesByName('foo');
        expect(results).toEqual([]);
    });
});
