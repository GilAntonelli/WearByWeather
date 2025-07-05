
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




// utils/weatherColors.ts

const conditionColorMap: Record<string, string> = {
  'céu limpo': '#A4D4FF',
  'céu pouco nublado': '#abb4bc',
  'nevoeiro': '#d1dade',
  'poucas nuvens': '#C3D9F3',
  'nuvens dispersas': '#D6E0EB',
  'nuvens encobertas': '#BFC8D1',
  'nublado': '#BFC8D1',
  'parcialmente nublado': '#D6E0EB',

  'chuva leve': '#A1BBD4',
  'chuva moderada': '#90AEC7',
  'chuva': '#7FA1BF',
  'chuva forte': '#5F7C99',
  'trovoadas': '#495866',
  'trovoada': '#495866',
  'tempestade': '#3D4C5C',

  'neve': '#E0F7FA',
  'neblina': '#E8ECEF',
  'névoa': '#DDE4E8',
  'névoa seca': '#D9E2E6',

  'garoa': '#B5C7D3',
  'poeira': '#E9D8B5',
  'tornado': '#4D4D4D',
};

const DEFAULT_COLOR = '#A4D4FF';

export function getWeatherBackgroundColor(condicao: string = ''): string {
  const condicaoNormalizada = condicao
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

  return conditionColorMap[condicaoNormalizada] ?? DEFAULT_COLOR;
}

export function getWeatherGradientColors(condicao: string = ''): [string, string] {
  const base = getWeatherBackgroundColor(condicao);
  return [base, '#00000077']; // degrade com branco translúcido
}
