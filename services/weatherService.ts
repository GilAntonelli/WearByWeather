// /src/services/weatherService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'd194bf6b1ee21e75acd3b22816fada11';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const WEATHER_CACHE_KEY = 'cached_weather';
const WEATHER_CACHE_TTL = 15 * 60 * 1000; // 15 minutos

export async function getWeatherByCity(city: string) {
  const now = Date.now();

  try {
    // Tenta usar cache
    const cached = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const isFresh = now - parsed.timestamp < WEATHER_CACHE_TTL && parsed.city === city;

      if (isFresh) {
        console.log('Usando clima do cache');
        return parsed.data;
      }
    }

    // Busca dados atualizados da API
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        units: 'metric',
        lang: 'pt',
        appid: API_KEY,
      },
    });

    const data = response.data;
    console.log('Resposta bruta da API:', data);

    const result = {
      temperatura: Math.round(data.main.temp),
      sensacaoTermica: Math.round(data.main.feels_like),
      chuva: data.weather[0].main.toLowerCase().includes('rain'),
      vento: Math.round(data.wind.speed * 3.6), // m/s → km/h
      condicao: data.weather[0].description,
      descricao: data.weather[0].main,
    };

    // Salva no cache
    await AsyncStorage.setItem(
      WEATHER_CACHE_KEY,
      JSON.stringify({ city, timestamp: now, data: result })
    );

    return result;
  } catch (error) {
    console.error('Erro ao buscar clima:', error);
    return null;
  }
}
