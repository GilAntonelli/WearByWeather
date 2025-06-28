
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
'céu limpo': '#A4D4FF',               // azul claro
  'céu pouco nublado': '#abb4bc',       // cinza claro
  'nevoeiro': '#d1dade',                // cinza pálido
  'poucas nuvens': '#C3D9F3',           // azul acinzentado
  'nuvens dispersas': '#D6E0EB',        // azul acinzentado claro
  'nuvens encobertas': '#BFC8D1',       // cinza médio

  'chuva leve': '#A1BBD4',              // azul acinzentado úmido
  'chuva moderada': '#90AEC7',          // azul escuro suave
  'chuva': '#7FA1BF',                   // azul médio
  'chuva forte': '#5F7C99',             // azul escuro
  'trovoadas': '#495866',              // azul chumbo
  'tempestade': '#3D4C5C',              // azul bem escuro

  'neve': '#E0F7FA',                    // branco gelo
  'neblina': '#E8ECEF',                 // cinza muito claro
  'névoa': '#DDE4E8',                   // cinza leitoso
  'névoa seca': '#D9E2E6',              // cinza seco
 // 'nevoeiro': '#d1dade',                // já presente, repetido para reforço

  'garoa': '#B5C7D3',                   // azul suave
  'poeira': '#E9D8B5',                  // areia claro
  'tornado': '#4D4D4D',                 // cinza escuro dramático
};

const DEFAULT_COLOR = '#A4D4FF';

export function getWeatherBackgroundColor(condicao: string = ''): string {
  const condicaoNormalizada = condicao
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

  return conditionColorMap[condicaoNormalizada] ?? DEFAULT_COLOR;
}
