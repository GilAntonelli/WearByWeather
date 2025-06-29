
import { getSuggestionByWeather } from '../suggestionEngine';

describe('getSuggestionByWeather - engine climático', () => {
  it('Frio com conforto = "frio" → deve sugerir casaco, calça e acessórios de frio', () => {
    const result = getSuggestionByWeather({
      temperatura: 12,
      sensacaoTermica: 10,
      vento: 10,
      umidade: 80,
      visibilidade: 10000,
      chuva: false,
      clima: 'Nublado',
      genero: 'feminino',
      conforto: 'frio',
    });

    console.log('🔍 ACESSÓRIOS (FRIO):', result.acessórios);

    expect(result.roupaSuperior.toLowerCase()).toContain('casaco');
    expect(result.roupaInferior.toLowerCase()).toContain('calça');
    expect(result.acessórios).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/touca/i),
        expect.stringMatching(/cachecol/i),
        expect.stringMatching(/luvas térmicas|luva/i),
      ])
    );
  });

  it('Calor com conforto = "calor" → deve sugerir roupas leves e acessórios de calor', () => {
    const result = getSuggestionByWeather({
      temperatura: 32,
      sensacaoTermica: 35,
      vento: 5,
      umidade: 50,
      visibilidade: 10000,
      chuva: false,
      clima: 'Ensolarado',
      genero: 'feminino',
      conforto: 'calor',
    });

    console.log('🔍 ACESSÓRIOS (CALOR):', result.acessórios);

    expect(result.roupaSuperior.toLowerCase()).toMatch(/camiseta|regata/);
    expect(result.roupaInferior.toLowerCase()).toMatch(/short|saia|bermuda/);
    expect(result.acessórios).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/óculos escuros|óculos/i),
        expect.stringMatching(/protetor solar/i),
        expect.stringMatching(/boné/i),
      ])
    );
  });

  it('Chuva = true → deve incluir acessórios de chuva', () => {
    const result = getSuggestionByWeather({
      temperatura: 22,
      sensacaoTermica: 21,
      vento: 10,
      umidade: 90,
      visibilidade: 8000,
      chuva: true,
      clima: 'Chuva',
      genero: 'masculino',
      conforto: 'frio',
    });

    console.log('🔍 ACESSÓRIOS (CHUVA):', result.acessórios);

    expect(result.acessórios).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/guarda-chuva/i),
        expect.stringMatching(/capa de chuva/i),
        expect.stringMatching(/bota impermeável/i),
      ])
    );
  });

  it('Vento forte (>25) → deve incluir acessórios de vento', () => {
    const result = getSuggestionByWeather({
      temperatura: 20,
      sensacaoTermica: 18,
      vento: 30,
      umidade: 70,
      visibilidade: 10000,
      chuva: false,
      clima: 'Vento',
      genero: 'unissex',
      conforto: 'frio',
    });

    console.log('🔍 ACESSÓRIOS (VENTO):', result.acessórios);

    expect(result.acessórios).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/corta-vento/i),
        expect.stringMatching(/gorro ajustado/i),
        expect.stringMatching(/elástico de cabelo/i),
      ])
    );
  });
});
