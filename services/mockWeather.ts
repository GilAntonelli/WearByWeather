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

/*
Como usar:
- Descomente apenas UM bloco `mockWeather` por vez para testar.
- Cada bloco é nomeado com o clima, temperatura e objetivo visual.
*/


// services/mockWeather.ts

 // ❄️ FREEZING
 
// export const mockWeather = {
//   temperatura: 1,
//   sensacaoTermica: -3,
//   tempMin: 2,
//   tempMax: 7,
//   umidade: 85,
//   chuva: false,
//   vento: 20,
//   condicao: 'neve fraca',
//   descricao: 'Snow',
//   icon: '13d',
//   iconUrl: 'https://openweathermap.org/img/wn/13d@2x.png',
//   id: 600,
// };
 

// 🧊 COLD
 
export const mockWeather = {
  temperatura: 10,
  sensacaoTermica: 8,
  tempMin: 7,
  tempMax: 12,
  umidade: 80,
  chuva: false,
  vento: 12,
  condicao: 'céu nublado',
  descricao: 'Clouds',
  icon: '03d',
  iconUrl: 'https://openweathermap.org/img/wn/03d@2x.png',
  id: 802,
};
 

// 🌀 CHILLY
/*
export const mockWeather = {
  temperatura: 14,
  sensacaoTermica: 13,
  tempMin: 11,
  tempMax: 16,
  umidade: 75,
  chuva: false,
  vento: 10,
  condicao: 'nevoeiro',
  descricao: 'Mist',
  icon: '50d',
  iconUrl: 'https://openweathermap.org/img/wn/50d@2x.png',
  id: 741,
};
*/

// 🌤️ MILD
/*
export const mockWeather = {
  temperatura: 17,
  sensacaoTermica: 18,
  tempMin: 15,
  tempMax: 19,
  umidade: 70,
  chuva: false,
  vento: 9,
  condicao: 'céu limpo',
  descricao: 'Clear',
  icon: '01d',
  iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
  id: 800,
};
*/

// 🌈 COMFORTABLE
/*
export const mockWeather = {
  temperatura: 21,
  sensacaoTermica: 22,
  tempMin: 19,
  tempMax: 23,
  umidade: 60,
  chuva: false,
  vento: 8,
  condicao: 'algumas nuvens',
  descricao: 'Clouds',
  icon: '02d',
  iconUrl: 'https://openweathermap.org/img/wn/02d@2x.png',
  id: 801,
};
*/

// ☀️ WARM
/*
export const mockWeather = {
  temperatura: 26,
  sensacaoTermica: 28,
  tempMin: 24,
  tempMax: 29,
  umidade: 55,
  chuva: false,
  vento: 6,
  condicao: 'ensolarado',
  descricao: 'Clear',
  icon: '01d',
  iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
  id: 800,
};
*/

// 🔥 HOT
/*
export const mockWeather = {
  temperatura: 31,
  sensacaoTermica: 34,
  tempMin: 29,
  tempMax: 33,
  umidade: 50,
  chuva: false,
  vento: 5,
  condicao: 'ensolarado',
  descricao: 'Clear',
  icon: '01d',
  iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
  id: 800,
};
*/

// 🥵 EXTREME HEAT
/*
export const mockWeather = {
  temperatura: 38,
  sensacaoTermica: 42,
  tempMin: 36,
  tempMax: 40,
  umidade: 40,
  chuva: false,
  vento: 4,
  condicao: 'calor extremo',
  descricao: 'Extreme heat',
  icon: '01d',
  iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
  id: 904,
};
*/


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
