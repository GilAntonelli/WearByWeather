import { getFraseClimatica } from '../weatherPhrases';

describe('Frases climáticas inteligentes', () => {
  it('Regra 1: acima de 30°C e sol', () => {
    const res = getFraseClimatica({ temperatura: 32, condicao: 'céu limpo e sol', chuva: false, vento: 10 });
    expect(res).toBe('32°C e sol brilhando. Prepare-se para um dia quente!');
  });

  it('Regra 2: entre 15°C e 30°C e céu limpo', () => {
    const res = getFraseClimatica({ temperatura: 22, condicao: 'céu limpo', chuva: false, vento: 5 });
    expect(res).toBe('22°C e céu limpo. Clima perfeito para um dia agradável!');
  });

  it('Regra 3: abaixo de 15°C e chuva', () => {
    const res = getFraseClimatica({ temperatura: 12, condicao: 'chuva fraca', chuva: true, vento: 5 });
    expect(res).toBe('12°C e chance de chuva. Vista-se quente e leve um guarda-chuva!');
  });

  it('Regra 4: entre 15°C e 30°C e sol', () => {
    const res = getFraseClimatica({ temperatura: 28, condicao: 'sol', chuva: false, vento: 5 });
    expect(res).toBe('28°C e sol. Um dia maravilhoso ao ar livre!');
  });

  it('Regra 5: entre 15°C e 30°C, nublado e chuva', () => {
    const res = getFraseClimatica({ temperatura: 19, condicao: 'nublado com pancadas de chuva', chuva: true, vento: 5 });
    expect(res).toBe('19°C e nublado com chance de chuva. Melhor levar um guarda-chuva!');
  });

  it('Regra 6: entre 15°C e 30°C com ventos fortes', () => {
    const res = getFraseClimatica({ temperatura: 24, condicao: 'céu limpo', chuva: false, vento: 35 });
    expect(res).toBe('24°C e ventos fortes. Proteja-se do vento hoje!');
  });

  it('Regra 7: < 15°C, nublado, chuva fraca', () => {
    const res = getFraseClimatica({ temperatura: 7, condicao: 'nublado com chuva fraca', chuva: true, vento: 10 });
    expect(res).toBe('7°C, frio e nublado com chuva fraca. Prepare-se para o dia gelado!');
  });

  it('Regra 8: < 0°C e neve', () => {
    const res = getFraseClimatica({ temperatura: -2, condicao: 'neve', chuva: true, vento: 8 });
    expect(res).toBe('Neve no horizonte! Prepare-se para um dia gelado com temperatura abaixo de zero.');
  });

  it('Regra 9: entre 0°C e 10°C com flocos de neve', () => {
    const res = getFraseClimatica({ temperatura: 4, condicao: 'flocos de neve', chuva: true, vento: 5 });
    expect(res).toBe('4°C e flocos de neve caindo. Um dia frio e encantado com neve!');
  });

  it('Regra 10: > 30°C com ventos fortes', () => {
    const res = getFraseClimatica({ temperatura: 35, condicao: 'sol', chuva: false, vento: 40 });
    expect(res).toBe('35°C com ventos fortes. Um dia quente e ventoso. Fique hidratado e proteja-se do vento!');
  });

  it('Regra 11: entre 15°C e 30°C com chuva forte', () => {
    const res = getFraseClimatica({ temperatura: 18, condicao: 'chuva forte', chuva: true, vento: 20 });
    expect(res).toBe('18°C e chuva forte. Melhor ficar dentro de casa ou leve um guarda-chuva resistente!');
  });

  it('Regra 12: entre 0°C e 15°C com neblina', () => {
    const res = getFraseClimatica({ temperatura: 10, condicao: 'neblina', chuva: false, vento: 10 });
    expect(res).toBe('10°C com neblina. Atenção ao sair, a visibilidade está baixa!');
  });

  it('Regra 13: > 30°C com umidade alta (simulada por condição "seco")', () => {
    const res = getFraseClimatica({ temperatura: 34, condicao: 'seco', chuva: false, vento: 10 });
    expect(res).toBe('30°C e ar seco. Lembre-se de se hidratar bem hoje!');
  });

  it('Regra 14: céu parcialmente nublado', () => {
    const res = getFraseClimatica({ temperatura: 25, condicao: 'parcialmente nublado', chuva: false, vento: 5 });
    expect(res).toBe('25°C com céu parcialmente nublado. O clima está agradável, aproveite o dia!');
  });

  it('Regra 15: tempestade com ventos fortes', () => {
    const res = getFraseClimatica({ temperatura: 28, condicao: 'tempestade', chuva: true, vento: 50 });
    expect(res).toBe('28°C e tempestade com ventos fortes. Fique seguro em casa e evite sair se possível!');
  });

  it('Regra 16: sol e chuva (simulado com condição combinada)', () => {
    const res = getFraseClimatica({ temperatura: 26, condicao: 'chuva com sol', chuva: true, vento: 5 });
    expect(res).toBe('O sol está aparecendo enquanto a chuva diminui. Prepare-se para um dia cheio de surpresas!');
  });

  it('Regra 17: clima seco e quente', () => {
    const res = getFraseClimatica({ temperatura: 30, condicao: 'seco', chuva: false, vento: 8 });
    expect(res).toBe('30°C e ar seco. Lembre-se de se hidratar bem hoje!');
  });

  it('Fallback: sem condições específicas e sem chuva', () => {
    const res = getFraseClimatica({ temperatura: 22, condicao: 'normal', chuva: false, vento: 5 });
    expect(res).toBe('Sem previsão de chuva por enquanto.');
  });

  it('Fallback: sem condições específicas, com chuva', () => {
    const res = getFraseClimatica({ temperatura: 22, condicao: 'indefinido', chuva: true, vento: 5 });
    expect(res).toBe('Pode chover hoje. Leve um guarda-chuva.');
  });
});
