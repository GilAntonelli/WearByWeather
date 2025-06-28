import { getFraseClimatica } from '../weatherPhrases';



describe('Frases climáticas inteligentes', () => {
  it('retorna frase de chuva com frio', () => {
    const resultado = getFraseClimatica({
      temperatura: 10,
      descricao: 'Rain',
      condicao: 'chuva leve',
      chuva: true,
      vento: 12,
    });
    expect(resultado).toMatch(/chuvoso e frio/i);
  });

  it('retorna frase de calor extremo', () => {
    const resultado = getFraseClimatica({
      temperatura: 37,
      descricao: 'Clear',
    });
    expect(resultado).toMatch(/calor extremo/i);
  });

  it('retorna frase de vento forte', () => {
    const resultado = getFraseClimatica({
      temperatura: 20,
      vento: 25,
    });
    expect(resultado).toMatch(/vento forte/i);
  });

  it('retorna frase de céu limpo com frio', () => {
    const resultado = getFraseClimatica({
      temperatura: 4,
      descricao: 'Clear',
    });
    expect(resultado).toMatch(/muito frio/i);
  });

  it('retorna frase de umidade alta', () => {
    const resultado = getFraseClimatica({
      temperatura: 25,
      umidade: 95,
    });
    expect(resultado).toMatch(/umidade muito alta/i);
  });

  it('retorna fallback padrão se nenhuma condição for satisfeita', () => {
    const resultado = getFraseClimatica({
      temperatura: 22,
      descricao: 'Clouds',
    });
    expect(typeof resultado).toBe('string');
    expect(resultado.length).toBeGreaterThan(0);
  });
});
