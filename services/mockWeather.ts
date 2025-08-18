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

// 🧊 COLD
 
export const mockWeather = {
  temperatura: 24,
  sensacaoTermica: 24,
  tempMin: 22,
  tempMax: 26,
  umidade: 80,
  chuva: false,
  vento: 12,
  condicao: 'céu nublado',
  descricao: 'Clouds',
  icon: '03d',
  iconUrl: 'https://openweathermap.org/img/wn/03d@2x.png',
  id: 802,
  localTime: '18:30',
};
 



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
 

 // 🌀 CHILLY
// export const mockWeather = {
//   temperatura: 14,
//   sensacaoTermica: 13,
//   tempMin: 11,
//   tempMax: 16,
//   umidade: 75,
//   chuva: false,
//   vento: 10,
//   condicao: 'nevoeiro',
//   descricao: 'Mist',
//   icon: '50d',
//   iconUrl: 'https://openweathermap.org/img/wn/50d@2x.png',
//   id: 741,
//   localTime: '18:30',
// };

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
  localTime: '18:30',
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
  localTime: '18:30',
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
  localTime: '18:30',
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
  localTime: '18:30',
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
  localTime: '18:30',
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
    localTime: '09:00',
    temperatura: '20°C',
    condicao: 'céu limpo',
    descricao: 'Clear',
    icon: '01d',
    vento: 10,
    chuva: false,
  },
  {
    hora: '12h',
    localTime: '12:00',
    temperatura: '22°C',
    condicao: 'parcialmente nublado',
    descricao: 'Clouds',
    icon: '02d',
    vento: 12,
    chuva: false,
  },
  {
    hora: '15h',
    localTime: '15:00',
    temperatura: '24°C',
    condicao: 'chuva leve',
    descricao: 'Rain',
    icon: '10d',
    vento: 18,
    chuva: true,
  },
  {
    hora: '18h',
    localTime: '18:00',
    temperatura: '21°C',
    condicao: 'nublado',
    descricao: 'Clouds',
    icon: '04d',
    vento: 15,
    chuva: false,
  },
  {
    hora: '21h',
    localTime: '21:00',
    temperatura: '19°C',
    condicao: 'céu limpo',
    descricao: 'Clear',
    icon: '01n',
    vento: 11,
    chuva: false,
  },
  {
    hora: '00h',
    localTime: '00:00',
    temperatura: '17°C',
    condicao: 'chuva leve',
    descricao: 'Rain',
    icon: '10n',
    vento: 10,
    chuva: true,
  },
  {
    hora: '03h',
    localTime: '03:00',
    temperatura: '16°C',
    condicao: 'nevoeiro',
    descricao: 'Fog',
    icon: '50n',
    vento: 8,
    chuva: false,
  },
  {
    hora: '06h',
    localTime: '06:00',
    temperatura: '15°C',
    condicao: 'céu limpo',
    descricao: 'Clear',
    icon: '01d',
    vento: 7,
    chuva: false,
  },
];