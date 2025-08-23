// services/weatherService.ts
import axios from 'axios';
import { API_KEY, BASE_URL, GEO_URL } from '../config/apiConfig';
import { mockWeather, mockHourlyForecast } from './mockWeather'; // ✅ mock importado
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { DateTime } from 'luxon';
import tzLookup from 'tz-lookup';

// Heuristic fallback: map OpenWeather condition codes to an estimated mm
function fallbackRainMmFromWeatherId(id: number): number {
  // Thunderstorm (200–232): usually some rain
  if (id >= 200 && id <= 232) return 2;

  // Drizzle (300–321)
  if (id >= 300 && id <= 321) return 0.5;

  // Rain (500–531)
  if (id === 500) return 1;   // light
  if (id === 501) return 3;   // moderate
  if (id === 502) return 6;   // heavy
  if (id === 503) return 10;  // very heavy
  if (id === 504) return 16;  // extreme
  if (id === 511) return 1;   // freezing rain
  if (id >= 520 && id <= 531) return 3; // shower rain

  // Snow (600–622): rough water equivalent
  if (id >= 600 && id <= 622) return 1;

  return 0;
}


const WEATHER_CACHE_KEY = 'cached_weather';
const WEATHER_CACHE_TTL = 15 * 60 * 1000; // 15 minutos
const USE_MOCK = false; // ✅ Altere para false para usar a API real
 

async function resolveCityToCoords(city: string) {
  const nomeParaApi = city;
  const geoResponse = await axios.get(`${GEO_URL}/direct`, {
    params: { q: nomeParaApi, limit: 1, appid: API_KEY },
    timeout: 10000,
  });
  const geoData = geoResponse.data;
  if (!geoData || geoData.length === 0) {
    throw new Error('Cidade não encontrada');
  }
  return { lat: geoData[0].lat, lon: geoData[0].lon };
}

function cacheKey(city: string, lang: string) {
  return `${WEATHER_CACHE_KEY}::v1::${city.trim().toLowerCase()}::${lang}`;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

type CachedWeather = {
  timestamp: number;
  city: string;
  lang: string;
  data: any;
};

export async function getWeatherByCity(city: string) {
  if (USE_MOCK) return mockWeather;

  const now = Date.now();
  const lang = mapLanguageToOpenWeather(i18n.language);
  const key = cacheKey(city, lang);

  try {
    // Try fresh cache
    const cachedRaw = await AsyncStorage.getItem(key);
    const cached = safeParse<CachedWeather>(cachedRaw);
    if (cached && now - cached.timestamp < WEATHER_CACHE_TTL) {
      return cached.data;
    }

    // Resolve coordinates
    const { lat, lon } = await resolveCityToCoords(city);

    // Fetch current weather
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, units: 'metric', lang, appid: API_KEY },
      timeout: 10000,
    });

    const data = response.data;

    const timezone = tzLookup(lat, lon);
    const localTime = DateTime.fromSeconds(data.dt, { zone: 'utc' })
      .setZone(timezone)
      .toFormat('HH:mm');

    const iconCode = data.weather?.[0]?.icon ?? '01d';
    const weatherMain = data.weather?.[0]?.main ?? '';
    const weatherId = data.weather?.[0]?.id ?? 0;

    // Robust precipitation/precip detection (rain or snow)
    const rainVolume = data?.rain?.['1h'] ?? data?.rain?.['3h'] ?? 0;
    const snowVolume = data?.snow?.['1h'] ?? data?.snow?.['3h'] ?? 0;
    let rainMM = Math.max(rainVolume, snowVolume);
    const weatherMainLower = String(weatherMain).toLowerCase();

    // Rain families
    const isRainByMain =
      weatherMainLower.includes('rain') ||
      weatherMainLower.includes('drizzle') ||
      weatherMainLower.includes('thunderstorm');
    const isRainById =
      typeof weatherId === 'number' &&
      ((weatherId >= 200 && weatherId <= 232) || // Thunderstorm
        (weatherId >= 300 && weatherId <= 321) || // Drizzle
        (weatherId >= 500 && weatherId <= 531));  // Rain

    // Snow families (⚠️ add this to be robust when no snow volume is present)
    const isSnowByMain = weatherMainLower.includes('snow');
    const isSnowById =
      typeof weatherId === 'number' && (weatherId >= 600 && weatherId <= 622);

    // Final flag: any precipitation counts as "chuva" for the app logic
    const chuva = isRainByMain || isRainById || isSnowByMain || isSnowById || rainVolume > 0 || snowVolume > 0;
    if (rainMM === 0 && chuva) {
      rainMM = fallbackRainMmFromWeatherId(weatherId);
    }

    const result = {
      temperatura: Math.round(data.main.temp),
      sensacaoTermica: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      umidade: data.main.humidity,
      chuva,
      vento: Math.round((data.wind?.speed ?? 0) * 3.6),
      condicao: data.weather?.[0]?.description ?? '',
      descricao: weatherMain,
      icon: iconCode,
      iconUrl: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
      id: weatherId,
      idioma: lang,
      localTime,
      timezone,
      rainMM,
    };

    await AsyncStorage.setItem(
      key,
      JSON.stringify({ timestamp: now, city, lang, data: result })
    );

    return result;
  } catch (error: any) {
    // Optional: finer-grained error mapping
    if (error?.response?.status === 401) {
      console.error('OpenWeather unauthorized (401). Check API key/plan.');
    }
    if (error?.code === 'ECONNABORTED') {
      console.error('OpenWeather timeout.');
    }
    console.error('Erro ao obter dados do clima:', error);
    throw error;
  }
}


// ✅ Função de previsão por hora
export async function getHourlyForecastByCity(city: string) {
  if (USE_MOCK) return mockHourlyForecast;

  try {
    const lang = mapLanguageToOpenWeather(i18n.language);
    const { lat, lon } = await resolveCityToCoords(city);
    const timezone = tzLookup(lat, lon);

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, units: 'metric', lang, appid: API_KEY },
      timeout: 10000,
    });

    const data = response.data;
    const list: any[] = Array.isArray(data?.list) ? data.list : [];
    if (list.length === 0) return [];

    const forecast = list.slice(0, Math.min(9, list.length)).map((entry: any) => {
      const iconCode = entry?.weather?.[0]?.icon ?? '01d';
      const hora = DateTime.fromSeconds(entry.dt, { zone: 'utc' })
        .setZone(timezone)
        .toFormat('HH:mm');

      // --- NEW: enrich each 3h block with feels-like, wind (km/h) and precipitation volume ---
      const feels = Math.round(entry?.main?.feels_like ?? entry?.main?.temp ?? 0);
      const windKmH = Math.round((entry?.wind?.speed ?? 0) * 3.6); // OpenWeather returns m/s
      const rain3h = entry?.rain?.['3h'] ?? 0;
      const snow3h = entry?.snow?.['3h'] ?? 0;
      const rainMM = Math.max(rain3h, snow3h); // mm in this 3h window (use snow if bigger)
      const chuva = rainMM > 0;

      return {
        hora,
        temperatura: Math.round(entry?.main?.temp ?? 0),
        sensacaoTermica: feels,        // NEW
        vento: windKmH,                // NEW (km/h)
        chuva,                         // NEW (boolean)
        rainMM,                        // NEW (mm for this 3h block)
        condicao: entry?.weather?.[0]?.description ?? '',
        icon: iconCode,
        iconUrl: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
      };
    });


    return forecast;
  } catch (error) {
    console.error('Erro ao obter previsão por hora:', error);
    throw error;
  }
}


export async function searchCitiesByName(name: string) {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: name,
        limit: 10,
        appid: API_KEY,
      },
    });

    return response.data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return [];
  }
}

  export function mapLanguageToOpenWeather(lang: string): string {
  const normalized = (lang || '').toLowerCase();

  // Handle common variants: 'pt', 'pt-pt', 'pt-PT'
  if (normalized === 'pt' || normalized.startsWith('pt-pt')) return 'pt';

  // Brazilian Portuguese must be 'pt_br' for OpenWeather
  if (normalized.startsWith('pt-br') || normalized === 'pt_br') return 'pt_br';

  // English fallback (covers en, en-US, en-GB, etc.)
  return 'en';
}