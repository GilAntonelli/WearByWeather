// /src/services/weatherService.ts
import axios from 'axios';

const API_KEY = 'd194bf6b1ee21e75acd3b22816fada11';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeatherByCity(city: string) {
  try {
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

    return {
      temperatura: Math.round(data.main.temp),
      sensacaoTermica: Math.round(data.main.feels_like),
      chuva: data.weather[0].main.toLowerCase().includes('rain'),
      vento: Math.round(data.wind.speed * 3.6), 
        condicao: data.weather[0].description,
          descricao: data.weather[0].main 


    };
  } catch (error) {
    console.error('Erro ao buscar clima:', error);
    return null;
  }
}
