import axios from 'axios';
import { API_KEY, BASE_URL, GEO_URL } from '../config/apiConfig';
import { mockWeather, mockHourlyForecast } from './mockWeather'; // ✅ mock importado
import { normalizeCityName } from '../utils/normalizeCity';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WEATHER_CACHE_KEY = 'cached_weather';
const WEATHER_CACHE_TTL = 15 * 60 * 1000; // 15 minutos
const USE_MOCK = true; // ✅ Altere para false para usar a API real


export async function getWeatherByCity(city: string) {
    if (USE_MOCK) {
    return mockWeather;
  }
  
  const now = Date.now();

  try {
    const nomeParaApi = normalizeCityName(city);

    const cached = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const isFresh =
        now - parsed.timestamp < WEATHER_CACHE_TTL && parsed.city === city;

      if (isFresh) {
        console.log('Usando clima do cache');
        return parsed.data;
      }
    }

    // Busca dados atualizados da API
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: nomeParaApi,
        units: 'metric',
        lang: 'pt',
        appid: API_KEY,
      },
    });

    const data = response.data;
    console.log('Resposta bruta da API:', data);
    
    const iconCode = data.weather[0].icon; // <-- DECLARADA aqui corretamente

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
      
    };

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





// ✅ Função de previsão por hora
export async function getHourlyForecastByCity(city: string) {
  try {
    const nomeParaApi = normalizeCityName(city);

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: nomeParaApi,
        units: 'metric',
        lang: 'pt',
        appid: API_KEY,
      },
    });

    const data = response.data;

    const horas = data.list.slice(0, 8).map((item: any) => ({
      hora: new Date(item.dt_txt).getHours() + 'h',
      temperatura: Math.round(item.main.temp) + '°C',
      condicao: item.weather[0].description,
      icon: item.weather[0].icon,
      vento: Math.round(item.wind.speed * 3.6),
      chuva: item.weather[0].main.toLowerCase().includes('rain'),
    }));

    return horas;
  } catch (error) {
    console.error('Erro ao buscar previsão por hora:', error);
    return [];
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


/*import { normalizeCityName } from '../utils/normalizeCity';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY, BASE_URL, GEO_URL } from '../config/apiConfig';

const WEATHER_CACHE_KEY = 'cached_weather';
const WEATHER_CACHE_TTL = 15 * 60 * 1000; // 15 minutos

export async function getWeatherByCity(city: string) {

  const now = Date.now();



  try {
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
    const response = await axios.get(`${BASE_URL}/weather`, {
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
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      umidade: data.main.humidity,
      chuva: data.weather[0].main.toLowerCase().includes('rain'),
      vento: Math.round(data.wind.speed * 3.6),
      condicao: data.weather[0].description,
      descricao: data.weather[0].main,
    };

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
// ✅ Função de previsão por hora

export async function getHourlyForecastByCity(city: string) {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        units: 'metric',
        lang: 'pt',
        appid: API_KEY,
      },
    });

    const data = response.data;

    const horas = data.list.slice(0, 8).map((item: any) => ({
      hora: new Date(item.dt_txt).getHours() + 'h',
      temperatura: Math.round(item.main.temp) + '°C',
      condicao: item.weather[0].description,
      icon: item.weather[0].icon,
      vento: Math.round(item.wind.speed * 3.6),
      chuva: item.weather[0].main.toLowerCase().includes('rain'),
    }));

    return horas;
  } catch (error) {
    console.error('Erro ao buscar previsão por hora:', error);
    return [];
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
*/