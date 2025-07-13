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

/*
Como usar:
- Descomente apenas UM bloco `mockWeather` por vez para testar.
- Cada bloco é nomeado com o clima, temperatura e objetivo visual.
*/

// 🔥 MUITO QUENTE – Look de verão, acessórios de sol (óculos, boné, protetor)
/*
export const mockWeather = {
  temperatura: 35,
  sensacaoTermica: 38,
  tempMin: 30,
  tempMax: 39,
  umidade: 35,
  chuva: false,
  vento: 5,
  condicao: 'céu limpo',
  descricao: 'Clear',
  icon: '01d',
  iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
};
*/

// ☁️ NUBLADO AMENO – Look meia-estação, sem acessórios específicos
/*
export const mockWeather = {
  temperatura: 21,
  sensacaoTermica: 20,
  tempMin: 18,
  tempMax: 23,
  umidade: 60,
  chuva: false,
  vento: 10,
  condicao: 'nublado',
  descricao: 'Clouds',
  icon: '04d',
  iconUrl: 'https://openweathermap.org/img/wn/04d@2x.png',
};
*/

// ☔ CHUVA MODERADA – Look com guarda-chuva, capa e bota
 
export const mockWeather = {
  temperatura: 43,
  sensacaoTermica: 38,
  tempMin: 15,
  tempMax: 19,
  umidade: 85,
  chuva: false,
  vento: 45,
  condicao: 'chuva moderada',
  descricao: 'Rain',
  icon: '10d',
  iconUrl: 'https://openweathermap.org/img/wn/10d@2x.png',
  id: 800, // ID do clima
};
 

// 🌩️ TROVOADA – Look com capa e proteção, acessórios de chuva + vento
 /* 
 export const mockWeather = {
  temperatura: 22,
  sensacaoTermica: 21,
  tempMin: 20,
  tempMax: 24,
  umidade: 90,
  chuva: true,
  vento: 20,
  condicao: 'trovoadas',
  descricao: 'Thunderstorm',
  icon: '11d',
  iconUrl: 'https://openweathermap.org/img/wn/11d@2x.png',
};
*/ 
// ❄️ FRIO – Look com casaco, cachecol, luvas, gorro
/*
export const mockWeather = {
  temperatura: 10,
  sensacaoTermica: 7,
  tempMin: 8,
  tempMax: 12,
  umidade: 70,
  chuva: false,
  vento: 18,
  condicao: 'céu limpo',
  descricao: 'Clear',
  icon: '01d',
  iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
};
*/

// 💨 VENTO – Look com corta-vento, gorro ajustado, elástico de cabelo
 /*
export const mockWeather = {
  temperatura: 19,
  sensacaoTermica: 18,
  tempMin: 17,
  tempMax: 21,
  umidade: 60,
  chuva: false,
  vento: 30,
  condicao: 'nublado',
  descricao: 'Clouds',
  icon: '04d',
  iconUrl: 'https://openweathermap.org/img/wn/04d@2x.png',
};
 
*/
// 🌫️ NEVOEIRO – Look com jaqueta leve, sem muitos acessórios
/*
export const mockWeather = {
  temperatura: 14,
  sensacaoTermica: 13,
  tempMin: 12,
  tempMax: 15,
  umidade: 95,
  chuva: false,
  vento: 6,
  condicao: 'nevoeiro',
  descricao: 'Fog',
  icon: '50d',
  iconUrl: 'https://openweathermap.org/img/wn/50d@2x.png',
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
