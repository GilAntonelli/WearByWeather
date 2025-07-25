import { LookSuggestion, LookSuggestionJson, WeatherContext, OverlaysJson } from '../types/suggestion';
import { TFunction } from 'i18next';

//#region Avatar Map
const avatarMap: Record<string, any> = {
  'freezing_male_feel_cold': require('../assets/avatars/freezing/male/feel_colder/avatar.png'),
  'freezing_male_feel_hot': require('../assets/avatars/freezing/male/feel_hot/avatar.png'),
  'freezing_male_neutral': require('../assets/avatars/freezing/male/neutral/avatar.png'),
  'freezing_female_feel_cold': require('../assets/avatars/freezing/female/feel_colder/avatar.png'),
  'freezing_female_feel_hot': require('../assets/avatars/freezing/female/feel_hot/avatar.png'),
  'freezing_female_neutral': require('../assets/avatars/freezing/female/neutral/avatar.png'),
  'freezing_unisex_feel_cold': require('../assets/avatars/freezing/unisex/feel_colder/avatar.png'),
  'freezing_unisex_feel_hot': require('../assets/avatars/freezing/unisex/feel_hot/avatar.png'),
  'freezing_unisex_neutral': require('../assets/avatars/freezing/unisex/neutral/avatar.png'),

  'cold_male_feel_cold': require('../assets/avatars/cold/male/feel_colder/avatar.png'),
  'cold_male_feel_hot': require('../assets/avatars/cold/male/feel_hot/avatar.png'),
  'cold_male_neutral': require('../assets/avatars/cold/male/neutral/avatar.png'),
  'cold_female_feel_cold': require('../assets/avatars/cold/female/feel_colder/avatar.png'),
  'cold_female_feel_hot': require('../assets/avatars/cold/female/feel_hot/avatar.png'),
  'cold_female_neutral': require('../assets/avatars/cold/female/neutral/avatar.png'),
  'cold_unisex_feel_cold': require('../assets/avatars/cold/unisex/feel_colder/avatar.png'),
  'cold_unisex_feel_hot': require('../assets/avatars/cold/unisex/feel_hot/avatar.png'),
  'cold_unisex_neutral': require('../assets/avatars/cold/unisex/neutral/avatar.png'),

  'chilly_male_feel_cold': require('../assets/avatars/chilly/male/feel_colder/avatar.png'),
  'chilly_male_feel_hot': require('../assets/avatars/chilly/male/feel_hot/avatar.png'),
  'chilly_male_neutral': require('../assets/avatars/chilly/male/neutral/avatar.png'),
  'chilly_female_feel_cold': require('../assets/avatars/chilly/female/feel_colder/avatar.png'),
  'chilly_female_feel_hot': require('../assets/avatars/chilly/female/feel_hot/avatar.png'),
  'chilly_female_neutral': require('../assets/avatars/chilly/female/neutral/avatar.png'),
  'chilly_unisex_feel_cold': require('../assets/avatars/chilly/unisex/feel_colder/avatar.png'),
  'chilly_unisex_feel_hot': require('../assets/avatars/chilly/unisex/feel_hot/avatar.png'),
  'chilly_unisex_neutral': require('../assets/avatars/chilly/unisex/neutral/avatar.png'),

  'mild_male_feel_cold': require('../assets/avatars/mild/male/feel_colder/avatar.png'),
  'mild_male_feel_hot': require('../assets/avatars/mild/male/feel_hot/avatar.png'),
  'mild_male_neutral': require('../assets/avatars/mild/male/neutral/avatar.png'),
  'mild_female_feel_cold': require('../assets/avatars/mild/female/feel_colder/avatar.png'),
  'mild_female_feel_hot': require('../assets/avatars/mild/female/feel_hot/avatar.png'),
  'mild_female_neutral': require('../assets/avatars/mild/female/neutral/avatar.png'),
  'mild_unisex_feel_cold': require('../assets/avatars/mild/unisex/feel_colder/avatar.png'),
  'mild_unisex_feel_hot': require('../assets/avatars/mild/unisex/feel_hot/avatar.png'),
  'mild_unisex_neutral': require('../assets/avatars/mild/unisex/neutral/avatar.png'),

  'comfortable_male_feel_cold': require('../assets/avatars/comfortable/male/feel_colder/avatar.png'),
  'comfortable_male_feel_hot': require('../assets/avatars/comfortable/male/feel_hot/avatar.png'),
  'comfortable_male_neutral': require('../assets/avatars/comfortable/male/neutral/avatar.png'),
  'comfortable_female_feel_cold': require('../assets/avatars/comfortable/female/feel_colder/avatar.png'),
  'comfortable_female_feel_hot': require('../assets/avatars/comfortable/female/feel_hot/avatar.png'),
  'comfortable_female_neutral': require('../assets/avatars/comfortable/female/neutral/avatar.png'),
  'comfortable_unisex_feel_cold': require('../assets/avatars/comfortable/unisex/feel_colder/avatar.png'),
  'comfortable_unisex_feel_hot': require('../assets/avatars/comfortable/unisex/feel_hot/avatar.png'),
  'comfortable_unisex_neutral': require('../assets/avatars/comfortable/unisex/neutral/avatar.png'),

  'warm_male_feel_cold': require('../assets/avatars/warm/male/feel_colder/avatar.png'),
  'warm_male_feel_hot': require('../assets/avatars/warm/male/feel_hot/avatar.png'),
  'warm_male_neutral': require('../assets/avatars/warm/male/neutral/avatar.png'),
  'warm_female_feel_cold': require('../assets/avatars/warm/female/feel_colder/avatar.png'),
  'warm_female_feel_hot': require('../assets/avatars/warm/female/feel_hot/avatar.png'),
  'warm_female_neutral': require('../assets/avatars/warm/female/neutral/avatar.png'),
  'warm_unisex_feel_cold': require('../assets/avatars/warm/unisex/feel_colder/avatar.png'),
  'warm_unisex_feel_hot': require('../assets/avatars/warm/unisex/feel_hot/avatar.png'),
  'warm_unisex_neutral': require('../assets/avatars/warm/unisex/neutral/avatar.png'),

  'hot_male_feel_cold': require('../assets/avatars/freezing/male/feel_colder/avatar.png'),
  'hot_male_feel_hot': require('../assets/avatars/freezing/male/feel_hot/avatar.png'),
  'hot_male_neutral': require('../assets/avatars/freezing/male/neutral/avatar.png'),
  'hot_female_feel_cold': require('../assets/avatars/freezing/female/feel_colder/avatar.png'),
  'hot_female_feel_hot': require('../assets/avatars/freezing/female/feel_hot/avatar.png'),
  'hot_female_neutral': require('../assets/avatars/freezing/female/neutral/avatar.png'),
  'hot_unisex_feel_cold': require('../assets/avatars/freezing/unisex/feel_colder/avatar.png'),
  'hot_unisex_feel_hot': require('../assets/avatars/freezing/unisex/feel_hot/avatar.png'),
  'hot_unisex_neutral': require('../assets/avatars/freezing/unisex/neutral/avatar.png'),

  'extreme_heat_male_feel_cold': require('../assets/avatars/extreme_heat/male/feel_colder/avatar.png'),
  'extreme_heat_male_feel_hot': require('../assets/avatars/extreme_heat/male/feel_hot/avatar.png'),
  'extreme_heat_male_neutral': require('../assets/avatars/extreme_heat/male/neutral/avatar.png'),
  'extreme_heat_female_feel_cold': require('../assets/avatars/extreme_heat/female/feel_colder/avatar.png'),
  'extreme_heat_female_feel_hot': require('../assets/avatars/extreme_heat/female/feel_hot/avatar.png'),
  'extreme_heat_female_neutral': require('../assets/avatars/extreme_heat/female/neutral/avatar.png'),
  'extreme_heat_unisex_feel_cold': require('../assets/avatars/extreme_heat/unisex/feel_colder/avatar.png'),
  'extreme_heat_unisex_feel_hot': require('../assets/avatars/extreme_heat/unisex/feel_hot/avatar.png'),
  'extreme_heat_unisex_neutral': require('../assets/avatars/extreme_heat/unisex/neutral/avatar.png'),
};
//#endregion

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
  let shoes = '';
  let acessórios: string[] = [];
  let recommendation = '';
  let image = null;

  let suggestions = getSuggestionsJson(genero, getThermalRangeDecription(tempAjustada), conforto, t);
  roupaSuperior = suggestions.roupaSuperior;
  roupaInferior = suggestions.roupaInferior;
  shoes = suggestions.shoes;
  acessórios = suggestions.acessórios || [];
  recommendation = suggestions.recommendation;
  image = suggestions.image;

  let overlays = getOverlays(chuva, vento, tempAjustada, 5, t); //Para o valor 5 deverá ser obtido o volume de chuva em mm
  if (overlays) {
    console.log('Overlays:', overlays);
    acessórios.push(...overlays.accessories);
    recommendation += overlays.description;
  }

  return {
    roupaSuperior,
    roupaInferior,
    acessórios,
    shoes,
    recommendation,
    image: image,
  };
}

function getAvatar(faixa: string, genero: string, conforto: string): any {
  const key = `${faixa}_${genero}_${conforto}`;
  return avatarMap[key];
}

export function getSuggestionsJson(
  gender: string,
  rangeDescription: string,
  comfort: string,
  t: TFunction
): LookSuggestion {
  console.log('chave', `suggestions.${gender}.${rangeDescription}.${comfort}`);
  let suggestions = t(`suggestions.${gender}.${rangeDescription}.${comfort}`, {
    returnObjects: true,
  }) as LookSuggestionJson;

  return {
    roupaSuperior: suggestions.top || suggestions.singlePiece,
    roupaInferior: suggestions.bottom || '',
    shoes: suggestions.shoes || '',
    acessórios: suggestions.accessories || [],
    recommendation: suggestions.recommendation || '',
    image: getAvatar(rangeDescription, gender, comfort),
  };
}

export function getRainWindSuggestionsJson(
  event: string,
  dimension: string,
  t: TFunction
): OverlaysJson {

  let suggestions = t(`overlays.${event}.${dimension}`, {
    returnObjects: true,
  }) as OverlaysJson;

  return suggestions;
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

export function getRainMMDescription(rainMM: number): string {
  if (rainMM >= 5) return 'rain_5+';
  if (rainMM >= 3) return 'rain_3+';
  return 'rain_1+';
}

export function getWindKMHDescription(windKMH: number): string {
  if (windKMH >= 45) return 'wind_45+';
  if (windKMH >= 30) return 'wind_30_45';
  if (windKMH >= 20) return 'wind_20+';
  return 'wind_10+';
}

export function getWindAndRainDescription(): string {
  return 'wind_20+_and_rain_3+';
}

export function getWindAndWarmDescription(): string {
  return 'temp_23+_and_wind_30+';
}

export function getOverlays(chuva: boolean, vento: number, tempAjustada: number, rainMM: number, t: TFunction): OverlaysJson {
  let overlays: OverlaysJson = {
    description: '',
    accessories: '',
    recommendation: ''
  }
  console.log('chuva:', chuva);
  console.log('vento:', vento);
  console.log('tempAjustada:', tempAjustada);
  console.log('rainMM:', rainMM);

  if (chuva) {
    if (vento >= 20) {
      overlays = getRainWindSuggestionsJson('windandrain', getWindAndRainDescription(), t);
    } else {
      overlays = getRainWindSuggestionsJson('rain', getRainMMDescription(rainMM), t);
    }
  } else if (vento >= 30) {
    if (tempAjustada >= 23) {
      overlays = getRainWindSuggestionsJson('windandwarm', getWindAndWarmDescription(), t);
    }
    else {
      overlays = getRainWindSuggestionsJson('wind', getWindKMHDescription(vento), t);
    }
  }
  return overlays;
}