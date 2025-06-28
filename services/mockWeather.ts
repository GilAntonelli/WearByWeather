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





// 👇 Preset selecionado manualmente (caso não use painel dinâmico):
export const mockWeather = {
  temperatura: 5,
  tempMax: 45,
  tempMin: 30,
  sensacaoTermica: 21,
  condicao: 'nublado', //descrição 
  descricao: 'Clear', // main
  icon: '01d',
  chuva: false,
  vento: 10,
  umidade: 60,
};

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
