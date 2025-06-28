import { normalizeCityName } from '../normalizeCity';

describe('normalizeCityName', () => {
  it('deve retornar o nome convertido corretamente para nomes com acento', () => {
    expect(normalizeCityName('Amsterdã')).toBe('Amsterdam');
    expect(normalizeCityName('São Paulo')).toBe('Sao Paulo');
    expect(normalizeCityName('Bruxelas')).toBe('Brussels');
    expect(normalizeCityName('Londres')).toBe('London');
    expect(normalizeCityName('Berlim')).toBe('Berlin');
    expect(normalizeCityName('Roma')).toBe('Rome');
    expect(normalizeCityName('Nova Iorque')).toBe('New York');
    expect(normalizeCityName('Munique')).toBe('Munich');
    expect(normalizeCityName('Veneza')).toBe('Venice');
  });

  it('deve retornar o próprio nome se não houver mapeamento', () => {
    expect(normalizeCityName('Lisboa')).toBe('Lisboa');
    expect(normalizeCityName('Porto')).toBe('Porto');
    expect(normalizeCityName('Tóquio')).toBe('Tóquio');
  });

  it('deve ser case sensitive e considerar nomes exatos', () => {
    expect(normalizeCityName('são paulo')).toBe('são paulo'); // sem mapeamento
    expect(normalizeCityName('SÃO PAULO')).toBe('SÃO PAULO'); // idem
  });
});
