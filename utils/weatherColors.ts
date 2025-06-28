
// utils/weatherColors.ts

const conditionColorMap: Record<string, string> = {
  'céu limpo': '#A4D4FF',
  'poucas nuvens': '#C3D9F3',
  'nuvens dispersas': '#D6E0EB',
  'nuvens encobertas': '#BFC8D1',
  'chuva leve': '#A1BBD4',
  'chuva': '#7FA1BF',
  'chuva forte': '#5F7C99',
  'tempestade': '#495866',
  'neve': '#E0F7FA',
  'neblina': '#E8ECEF',
};

const DEFAULT_COLOR = '#A4D4FF';

export function getWeatherBackgroundColor(condicao: string = ''): string {
  const condicaoNormalizada = condicao
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

  return conditionColorMap[condicaoNormalizada] ?? DEFAULT_COLOR;
}
