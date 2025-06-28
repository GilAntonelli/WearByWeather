/**
 * Mapeia nomes com acento ou variantes locais para nomes aceitos pela API.
 * Pode ser expandido com novos casos conforme necessário.
 */
const apiCityNames: Record<string, string> = {
  'Amsterdã': 'Amsterdam',
  'São Paulo': 'Sao Paulo',
  'Londres': 'London',
  'Berlim': 'Berlin',
  'Bruxelas': 'Brussels',
  'Roma': 'Rome',
  'Nova Iorque': 'New York',
  'Munique': 'Munich',
  'Veneza': 'Venice',
};

/**
 * Retorna o nome da cidade no formato aceito pela API.
 * Se não houver mapeamento, retorna o nome original.
 */
export function normalizeCityName(city: string): string {
  return apiCityNames[city] ?? city;
}
