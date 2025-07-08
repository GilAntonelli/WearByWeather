import { LookSuggestion, LookSuggestionJson, WeatherContext } from '../types/suggestion';
import { TFunction } from 'i18next';

export function getSuggestionByWeather({
  temperatura,
  sensacaoTermica,
  chuva,
  vento,
  genero,
  conforto,
  t
}: WeatherContext): LookSuggestion {
  const tempBase = (temperatura + sensacaoTermica) / 2;

  const confortoAjuste: Record<string, number> = {
    frio: -2,
    calor: 2,
    neutro: 0,
  };
  const tempAjustada = tempBase + (confortoAjuste[conforto] ?? 0);

  let roupaSuperior = '';
  let roupaInferior = '';
  let acessórios: string[] = [];
  let recomendação = '';
  let image = null;

  let suggestions = getSuggestions(genero, getThermalRangeDecription(tempAjustada), conforto, t);
  roupaSuperior = suggestions.roupaSuperior;
  roupaInferior = suggestions.roupaInferior;
  acessórios = suggestions.acessórios || [];
  recomendação = suggestions.recomendação;
  image = getAvatar('frio', genero);

  // ☔ Chuva
  if (chuva) {
    acessórios.push('Guarda-chuva', 'Capa de chuva', 'Bota impermeável');
    recomendação += ' Possibilidade de chuva.';
  }

  // 💨 Vento
  if (vento > 25) {
    acessórios.push('Jaqueta corta-vento', 'Gorro ajustado', 'Elástico de cabelo');
    recomendação += ' Ventos intensos previstos.';
  }

  return {
    roupaSuperior,
    roupaInferior,
    acessórios,
    recomendação,
    image: image,
  };
}

// Map estático para evitar erro no Metro bundler
const avatarMap: Record<string, any> = {
  'frio_masculino': require('../assets/images/frio/AvatarMasculino.png'),
  'frio_feminino': require('../assets/images/frio/AvatarFeminino.png'),
  'frio_unissex': require('../assets/images/frio/AvatarUnissex.png'),

  'fresco_masculino': require('../assets/images/fresco/AvatarMasculino.png'),
  'fresco_feminino': require('../assets/images/fresco/AvatarFeminino.png'),
  'fresco_unissex': require('../assets/images/fresco/AvatarUnissex.png'),

  'ameno_masculino': require('../assets/images/ameno/AvatarMasculino.png'),
  'ameno_feminino': require('../assets/images/ameno/AvatarFeminino.png'),
  'ameno_unissex': require('../assets/images/ameno/AvatarUnissex.png'),

  'quente_masculino': require('../assets/images/quente/AvatarMasculino.png'),
  'quente_feminino': require('../assets/images/quente/AvatarFeminino.png'),
  'quente_unissex': require('../assets/images/quente/AvatarUnissex.png'),

  'calor_masculino': require('../assets/images/calor/AvatarMasculino.png'),
  'calor_feminino': require('../assets/images/calor/AvatarFeminino.png'),
  'calor_unissex': require('../assets/images/calor/AvatarUnissex.png'),
};

function getAvatar(faixa: string, genero: string): any {
  const key = `${faixa}_${genero}`;
  return avatarMap[key] || avatarMap['ameno_masculino'];
}

export function getSuggestions(
  gender: string,
  range: string,
  comfort: string,
  t: TFunction
): LookSuggestion {

  let suggestions = t(`suggestions.${gender}.${range}.neutral`, {
    returnObjects: true,
  }) as LookSuggestionJson;
  
  return {
    roupaSuperior: suggestions.top || suggestions.singlePiece,
    roupaInferior: suggestions.bottom || '',
    acessórios: suggestions.accessories || [],
    recomendação: suggestions.recommendation || '',
    image: getAvatar(range, gender),
  };
}

export function getThermalRangeDecription(temperature: number): string {
  if (temperature <= 5) return 'freezing';
  if (temperature <= 10) return 'cold';
  if (temperature <= 13) return 'chilly';
  if (temperature <= 16) return 'mild';
  if (temperature <= 22) return 'comfortable';
  if (temperature <= 25) return 'warm';
  if (temperature <= 28) return 'hot';
  return 'extreme_heat';
}