



import { getWeatherBackgroundColor } from '../weatherColors';

describe('getWeatherBackgroundColor', () => {
  it('retorna a cor correta para condições conhecidas', () => {
    expect(getWeatherBackgroundColor('céu limpo')).toBe('#A4D4FF');
    expect(getWeatherBackgroundColor('poucas nuvens')).toBe('#C3D9F3');
    expect(getWeatherBackgroundColor('nuvens dispersas')).toBe('#D6E0EB');
    expect(getWeatherBackgroundColor('chuva')).toBe('#7FA1BF');
  });

  it('trata variações com maiúsculas e acentos', () => {
    expect(getWeatherBackgroundColor('CÉU LIMPO')).toBe('#A4D4FF');
    expect(getWeatherBackgroundColor('ChUvA LeVe')).toBe('#A1BBD4');
 expect(getWeatherBackgroundColor('NEBLINA')).toBe('#E8ECEF');

  });

  it('retorna cor padrão para condições desconhecidas', () => {
    expect(getWeatherBackgroundColor('alienígena gelado')).toBe('#A4D4FF');
    expect(getWeatherBackgroundColor('')).toBe('#A4D4FF');
    expect(getWeatherBackgroundColor(undefined as any)).toBe('#A4D4FF');
  });
});
