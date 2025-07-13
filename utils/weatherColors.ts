
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

export function getWeatherBackgroundColor(id: number): string {
  if (id >= 200 && id <= 202) return '#495866'; // Trovoadas leves a moderadas
  if (id >= 210 && id <= 221) return '#495866'; // Trovoadas locais
  if (id >= 230 && id <= 232) return '#3D4C5C'; // Tempestades com chuva forte

  if (id >= 300 && id <= 302) return '#B5C7D3'; // Garoa leve a moderada
  if (id >= 310 && id <= 321) return '#A1BBD4'; // Garoa com chuva

  if (id === 500) return '#A1BBD4';             // Chuva leve
  if (id === 501) return '#90AEC7';             // Chuva moderada
  if (id >= 502 && id <= 504) return '#5F7C99'; // Chuva forte a extrema
  if (id >= 511 && id <= 531) return '#7FA1BF'; // Chuva congelante e irregular

  if (id >= 600 && id <= 602) return '#E0F7FA'; // Neve leve a forte
  if (id >= 611 && id <= 622) return '#E0F7FA'; // Neve com garoa, irregular

  if (id === 701) return '#DDE4E8';             // Névoa
  if (id === 711) return '#D9E2E6';             // Fumaça (névoa seca)
  if (id === 721) return '#D9E2E6';             // Névoa seca (haze)
  if (id === 731 || id === 761) return '#E9D8B5'; // Poeira/sand/dust
  if (id === 741) return '#E8ECEF';             // Neblina
  if (id === 751) return '#E9D8B5';             // Areia
  if (id === 762) return '#E9D8B5';             // Cinzas vulcânicas
  if (id === 771) return '#4A5968';             // Rajadas de vento (squall)
  if (id === 781) return '#4D4D4D';             // Tornado

  if (id === 800) return '#A4D4FF';             // Céu limpo

  if (id === 801) return '#C3D9F3';             // Poucas nuvens
  if (id === 802) return '#D6E0EB';             // Nuvens dispersas
  if (id === 803) return '#BFC8D1';             // Nuvens parcialmente nubladas
  if (id === 804) return '#BFC8D1';             // Nuvens encobertas

  return DEFAULT_COLOR; // fallback
}

export function getWeatherGradientColors(id: number): [string, string] {
  const base = getWeatherBackgroundColor(id);
  return [base, '#00000077']; // degrade com branco translúcido
}
