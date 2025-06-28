// services/weatherPhrases.ts

type Clima = {
  temperatura: number;
  condicao?: string;       // ex: 'céu limpo'
  descricao?: string;      // ex: 'Clear'
  chuva?: boolean;
  vento?: number;
  umidade?: number;
};

/**
 * Retorna uma frase inteligente com base nas condições climáticas.
 */
export function getFraseClimatica({
  temperatura,
  condicao,
  descricao,
  chuva,
  vento,
  umidade,
}: Clima): string {
  // 🌧️ Chuva
  if (chuva && temperatura < 15) {
    return 'Dia chuvoso e frio. Leve guarda-chuva e agasalho.';
  }

  if (chuva) {
    return 'Chuva prevista. Não esqueça o guarda-chuva!';
  }

  // 🌬️ Vento
  if (vento !== undefined && vento > 30) {
    return 'Rajadas de vento fortes hoje. Fique atento ao sair.';
  }

  if (vento !== undefined && vento > 20) {
    return 'Vento forte hoje. Proteja-se bem ao sair.';
  }

  // ☀️ Calor
  if (descricao === 'Clear' && temperatura >= 35) {
    return 'Calor extremo. Fique em locais frescos e hidrate-se!';
  }

  if (descricao === 'Clear' && temperatura > 30) {
    return 'Muito sol e calor. Hidrate-se bem!';
  }

  // ❄️ Frio
  if (descricao === 'Clear' && temperatura <= 5) {
    return 'Céu limpo, mas muito frio. Se agasalhe bem.';
  }

  if (temperatura <= 5) {
    return 'Frio intenso hoje. Use roupas térmicas.';
  }

  if (temperatura < 10) {
    return 'Temperaturas baixas. Vista-se com camadas quentes.';
  }

  // ☁️ Nuvens e neblina
  if (descricao === 'Clouds' && temperatura < 15) {
    return 'Tempo nublado e frio. Um casaco vai bem.';
  }

  if (descricao === 'Clouds') {
    return 'Tempo parcialmente nublado. Aproveite com moderação.';
  }

  if (descricao === 'Fog' || condicao?.includes('nevoeiro')) {
    return 'Nevoeiro no ar. Atenção à visibilidade.';
  }

  if (descricao === 'Mist') {
    return 'Neblina leve. Pode ser desconfortável pela manhã.';
  }

  // 💧 Umidade
  if (umidade !== undefined && umidade > 90) {
    return 'Umidade muito alta. Pode causar desconforto.';
  }

  if (umidade !== undefined && umidade < 30) {
    return 'Ar seco hoje. Hidrate-se e evite exposição prolongada.';
  }

  // ☀️ Céu limpo padrão
  if (descricao === 'Clear') {
    return 'Céu limpo e clima estável. Bom dia para atividades ao ar livre.';
  }

  // 🟡 Fallback final
  return 'Clima estável hoje. Fique de olho nas variações ao longo do dia.';
}
