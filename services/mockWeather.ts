// services/mockWeather.ts

/*
| `main`       | `description` (condicao)       |
| ------------ | ------------------------------ |
| Clear        | céu limpo                      |
| Clouds       | nublado / parcialmente nublado |
| Rain         | chuva leve / chuva moderada    |
| Thunderstorm | trovoadas                      |
| Snow         | neve                           |
| Mist         | névoa                          |
| Drizzle      | garoa                          |
| Haze         | névoa seca                     |
| Fog          | nevoeiro                       |
| Dust         | poeira                         |
| Tornado      | tornado                        |

*/

// Céu limpo
/* export const mockWeather = {
  temperatura: 27,
  sensacaoTermica: 28,
  tempMin: 22,
  tempMax: 30,
  umidade: 40,
  chuva: false,
  vento: 10,
  condicao: 'céu limpo',
  descricao: 'Clear',
  icon: '01d',
  iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
};
*/

// Nublado
/* export const mockWeather = {
  temperatura: 20,
  sensacaoTermica: 19,
  tempMin: 17,
  tempMax: 22,
  umidade: 65,
  chuva: false,
  vento: 15,
  condicao: 'nublado',
  descricao: 'Clouds',
  icon: '04d',
  iconUrl: 'https://openweathermap.org/img/wn/04d@2x.png',
};
*/

// Chuva moderada
/* export const mockWeather = {
  temperatura: 18,
  sensacaoTermica: 17,
  tempMin: 16,
  tempMax: 20,
  umidade: 85,
  chuva: true,
  vento: 20,
  condicao: 'chuva moderada',
  descricao: 'Rain',
  icon: '10d',
  iconUrl: 'https://openweathermap.org/img/wn/10d@2x.png',
};
*/

// Trovoada
/* export const mockWeather = {
  temperatura: 23,
  sensacaoTermica: 22,
  tempMin: 20,
  tempMax: 26,
  umidade: 90,
  chuva: true,
  vento: 25,
  condicao: 'trovoada',
  descricao: 'Thunderstorm',
  icon: '11d',
  iconUrl: 'https://openweathermap.org/img/wn/11d@2x.png',
};
*/

// Nevoeiro
export const mockWeather = {
  temperatura: 15,
  sensacaoTermica: 14,
  tempMin: 13,
  tempMax: 17,
  umidade: 95,
  chuva: false,
  vento: 5,
  condicao: 'nevoeiro',
  descricao: 'Fog',
  icon: '50d',
  iconUrl: 'https://openweathermap.org/img/wn/50d@2x.png',
};



/*
******************
 Forecast 
******************

*/

export const mockHourlyForecast = [
  {
    hora: '09h',
    temperatura: '20°C',
    condicao: 'céu limpo',
    descricao: 'Clear', // ✅ adicionado
    icon: '01d',
    vento: 10,
    chuva: false,
  },
  {
    hora: '12h',
    temperatura: '22°C',
    condicao: 'parcialmente nublado',
    descricao: 'Clouds',
    icon: '02d',
    vento: 12,
    chuva: false,
  },
  {
    hora: '15h',
    temperatura: '24°C',
    condicao: 'poucas nuvens',
    descricao: 'Clouds',
    icon: '03d',
    vento: 14,
    chuva: false,
  },
  {
    hora: '18h',
    temperatura: '21°C',
    condicao: 'nublado',
    descricao: 'Clouds',
    icon: '04d',
    vento: 11,
    chuva: false,
  },
  {
    hora: '21h',
    temperatura: '19°C',
    condicao: 'céu limpo',
    descricao: 'Clear',
    icon: '01n',
    vento: 9,
    chuva: false,
  },
  {
    hora: '00h',
    temperatura: '17°C',
    condicao: 'céu limpo',
    descricao: 'Clear',
    icon: '01n',
    vento: 8,
    chuva: false,
  },
  {
    hora: '03h',
    temperatura: '16°C',
    condicao: 'nevoeiro',
    descricao: 'Fog',
    icon: '50n',
    vento: 7,
    chuva: false,
  },
  {
    hora: '06h',
    temperatura: '15°C',
    condicao: 'céu limpo',
    descricao: 'Clear',
    icon: '01d',
    vento: 6,
    chuva: false,
  },
];
