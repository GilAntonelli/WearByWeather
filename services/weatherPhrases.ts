// /src/services/weatherPhrases.ts

export function getFraseClimatica({
  temperatura,
  condicao,
  chuva,
  vento
}: {
  temperatura: number;
  condicao?: string;
  chuva?: boolean;
  vento?: number;
}): string {
  const temp = temperatura;
  const cond = (condicao || '').toLowerCase();
  const hasChuva = chuva === true;
  const ventoForte = vento !== undefined && vento >= 30;

  const isNublado = cond.includes('nublado');
  const isCéuLimpo = cond.includes('céu limpo');
  const isSol = cond.includes('sol');
  const isChuvaForte = cond.includes('chuva forte');
  const isTempestade = cond.includes('tempestade');
  const isNeve = cond.includes('neve') || cond.includes('flocos de neve');
  const isNeblina = cond.includes('neblina') || cond.includes('névoa') || cond.includes('bruma');
  const isSeco = cond.includes('seco');
  const isParcial = cond.includes('parcial') || cond.includes('parcialmente nublado');
  const isSolEChuva = cond.includes('chuva') && cond.includes('sol');

  // Regras com prioridade mais alta primeiro

  if (temp < 0 && isNeve) return 'Neve no horizonte! Prepare-se para um dia gelado com temperatura abaixo de zero.';
  if (temp >= 0 && temp < 10 && isNeve) return 'Flocos de neve caindo. Um dia frio e encantado com neve!';
  if (isTempestade && ventoForte) return 'Tempestade com ventos fortes. Fique seguro em casa e evite sair se possível!';
  if (isSolEChuva) return 'O sol está aparecendo enquanto a chuva diminui. Prepare-se para um dia cheio de surpresas!';
  if (temp > 30 && ventoForte) return 'Ventos fortes. Um dia quente e ventoso. Fique hidratado e proteja-se do vento!';
 if (temp >= 30 && isSeco) return 'Ar seco. Lembre-se de se hidratar bem hoje!';
  if (temp > 30 && isSol) return 'Sol brilhando. Prepare-se para um dia quente!';

  if (temp > 15 && temp <= 30 && ventoForte) return 'Ventos fortes. Proteja-se do vento hoje!';
  if (temp > 15 && temp <= 30 && isChuvaForte) return 'Chuva forte. Melhor ficar dentro de casa ou leve um guarda-chuva resistente!';
  if (temp > 15 && temp <= 30 && isNublado && hasChuva) return 'Dia nublado com chance de chuva. Melhor levar um guarda-chuva!';
  if (temp > 15 && temp <= 30 && isCéuLimpo) return 'Céu limpo. Clima perfeito para um dia agradável!';
  if (temp > 15 && temp <= 30 && isSol) return 'Sol. Um dia maravilhoso ao ar livre!';

  if (temp < 15 && isNublado && hasChuva) return 'Frio e nublado com chuva fraca. Prepare-se para o dia gelado!';
  if (temp < 15 && hasChuva) return 'Chance de chuva. Vista-se quente e leve um guarda-chuva!';
  if (temp >= 0 && temp < 15 && isNeblina) return 'Neblina. Atenção ao sair, a visibilidade está baixa!';

  if (isParcial || isNublado) return 'Céu parcialmente nublado. O clima está agradável, aproveite o dia!';

  // Fallback padrão
  return hasChuva
    ? 'Pode chover hoje. Leve um guarda-chuva.'
    : 'Sem previsão de chuva por enquanto.';
}
