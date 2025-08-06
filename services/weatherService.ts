import axios from 'axios';
import { API_KEY, BASE_URL, GEO_URL } from '../config/apiConfig';
import { mockWeather, mockHourlyForecast } from './mockWeather'; // ✅ mock importado
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { format } from 'date-fns'; // instala se necessário: npm i date-fns
import { DateTime } from 'luxon';
import tzLookup from 'tz-lookup';

const WEATHER_CACHE_KEY = 'cached_weather';
const WEATHER_CACHE_TTL = 15 * 60 * 1000; // 15 minutos
const USE_MOCK = true; // ✅ Altere para false para usar a API real
const lang = mapLanguageToOpenWeather(i18n.language);

export async function getWeatherByCity(city: string) {
  if (USE_MOCK) {
    return mockWeather;
  }

  const now = Date.now();
  const lang = mapLanguageToOpenWeather(i18n.language);

  try {
    const nomeParaApi = city;

    const cached = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const isFresh =
        now - parsed.timestamp < WEATHER_CACHE_TTL && parsed.city === city;
      const changedLang = parsed.data.idioma !== lang;

      if (isFresh && !changedLang) {
        console.log('Usando clima do cache');
        return parsed.data;
      }
    }

    // 🌍 Buscar lat/lon via API de geocodificação
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct`,
      {
        params: {
          q: nomeParaApi,
          limit: 1,
          appid: API_KEY,
        },
      }
    );

    const geoData = geoResponse.data;
    if (!geoData || geoData.length === 0) {
      throw new Error('Cidade não encontrada');
    }

    const { lat, lon } = geoData[0];

    // 🌡️ Buscar clima atual com lat/lon
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: 'metric',
        lang: lang,
        appid: API_KEY,
      },
    });

    const data = response.data;
    console.log('Resposta bruta da API:', data);
    // 🕒 Calcular horário local com base no timestamp e timezone
    const timezone = tzLookup(lat, lon);

    const localTime = DateTime
      .fromSeconds(data.dt, { zone: 'utc' }) // origem é UTC!
      .setZone(timezone)                    // aplica a timezone real com DST
      .toFormat('HH:mm');

    const iconCode = data.weather[0].icon;

    const result = {
      temperatura: Math.round(data.main.temp),
      sensacaoTermica: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      umidade: data.main.humidity,
      chuva: data.weather[0].main.toLowerCase().includes('rain'),
      vento: Math.round(data.wind.speed * 3.6),
      condicao: data.weather[0].description,
      descricao: data.weather[0].main,
      icon: iconCode,
      iconUrl: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
      id: data.weather[0].id,
      idioma: lang,
      localTime,
      timezone,

    };

    await AsyncStorage.setItem(
      WEATHER_CACHE_KEY,
      JSON.stringify({
        timestamp: now,
        city,
        data: result,
      })
    );

    return result;
  } catch (error) {
    console.error('Erro ao obter dados do clima:', error);
    throw error;
  }
}

// ✅ Função de previsão por hora
export async function getHourlyForecastByCity(city: string) {
  if (USE_MOCK) {
    return mockHourlyForecast;
  }

  try {
    const nomeParaApi = city;
    const lang = mapLanguageToOpenWeather(i18n.language);
    // 1. Buscar lat/lon
    const geoResponse = await axios.get(
      'https://api.openweathermap.org/geo/1.0/direct',
      {
        params: {
          q: nomeParaApi,
          limit: 1,
          appid: API_KEY,
        },
      }
    );

    const geoData = geoResponse.data;
    if (!geoData || geoData.length === 0) {
      throw new Error('Cidade não encontrada');
    }

    const { lat, lon } = geoData[0];
    const timezone = tzLookup(lat, lon);

    // 2. Buscar previsão com lat/lon
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        units: 'metric',
        lang: lang,
        appid: API_KEY,
      },
    });

    const data = response.data;

    const forecast = data.list.slice(0, 9).map((entry: any) => {
      const iconCode = entry.weather[0].icon;

      const hora = DateTime
        .fromSeconds(entry.dt, { zone: 'utc' }) // origem sempre em UTC
        .setZone(timezone)                      // converte para hora local da cidade
        .toFormat('HH:mm');

      return {
        hora,
        temperatura: Math.round(entry.main.temp),
        condicao: entry.weather[0].description,
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
  switch (lang) {
    case 'pt-BR':
    case 'pt-PT':
      return 'pt';
    case 'en':
    default:
      return 'en';
  }
}
