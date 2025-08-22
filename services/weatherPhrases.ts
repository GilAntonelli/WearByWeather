// services/weatherPhrases.ts
import { TFunction } from 'i18next';

type Clima = {
  temperatura: number;
  condicao?: string;       // ex: 'céu limpo'
  descricao?: string;      // ex: 'Clear'
  chuva?: boolean;
  vento?: number;
  umidade?: number;
  rainMM?: number;
};

// Returns t(key) if it exists, otherwise t(fallbackKey).
const tt = (t: TFunction, key: string, fallbackKey: string) => {
  const v = t(key, { defaultValue: '' });
  // Se a chave não existe, i18next costuma retornar o próprio "key".
  // Assim, comparamos e caímos no fallback.
  if (v && v !== key && v.trim()) return v;
  return t(fallbackKey);
};


/**
 * Retorna uma frase inteligente com base nas condições climáticas.
 */
/**
* Returns a smart forecast phrase key based on weather conditions.
* Assumptions:
* - `vento` is in km/h (align your service conversion to ensure this).
* - `descricao` is the OpenWeather "main" when available (e.g., Clear, Clouds, Rain, etc.).
* - `condicao` is a localized/translated descriptor (PT), used as fallback.
*/
export function getFraseClimatica(
  t: TFunction,
  { temperatura, condicao, descricao, chuva, vento, umidade, rainMM }: Clima
): string {
  const main = normalizeMain(descricao, condicao);

  // Clamp humidity into a valid range [0..100]
  const humidity =
    typeof umidade === 'number'
      ? Math.max(0, Math.min(100, umidade))
      : undefined;

  // We assume `vento` is in km/h.
  const wind = typeof vento === 'number' ? vento : undefined;

  // Consolidate rain condition from multiple signals
  const isRainingByMain =
    main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm';
  const isRainingByMM = typeof rainMM === 'number' ? rainMM >= 0.2 : false; // any measurable rain
  const isRaining = Boolean(chuva || isRainingByMain || isRainingByMM);


  // ⛈️ Tempestade (fallback -> rain)
  if (main === 'Thunderstorm') {
    return tt(t, 'Forecast.thunderstorm', 'Forecast.rain');
  }

  // ❄️ Neve (fallback -> frio intenso)
  if (main === 'Snow') {
    return tt(t, 'Forecast.snow', 'Forecast.cold5-');
  }




  // 2) Rain (with cold-variant)
  // 🌧️ Chuva
  if (isRaining && temperatura < 15) {
    return t('Forecast.rainTemperature15-');
  }
  if (isRaining) {
    return t('Forecast.rain');
  }


  // 3) Wind
  if (wind !== undefined && wind > 30) {
    return t('Forecast.wind30+');
  }
  if (wind !== undefined && wind > 20) {
    return t('Forecast.wind20+');
  }

  // 4) Heat (under clear skies)
  if (main === 'Clear' && temperatura >= 35) {
    return t('Forecast.temperature35+');
  }
  if (main === 'Clear' && temperatura > 30) {
    return t('Forecast.temperature30+');
  }

  // 5) Cold
  if (main === 'Clear' && temperatura <= 5) {
    return t('Forecast.clearSkyCold5-');
  }
  if (temperatura <= 5) {
    return t('Forecast.cold5-');
  }
  if (temperatura < 10) {
    return t('Forecast.temperature10-');
  }

  // 6) Clouds
  if (main === 'Clouds' && temperatura < 15) {
    return t('Forecast.cloudsTemperature15-');
  }
  if (main === 'Clouds') {
    return t('Forecast.clouds');
  }

  // 7) Visibility/particles grouped to the "fog" messaging
  if (main === 'Fog' || main === 'Mist' || main === 'Haze') {
    return t('Forecast.fog');
  }
  if (condicao?.toLowerCase().includes('nevoeiro') || condicao?.toLowerCase().includes('névoa')) {
    return t('Forecast.fog');
  }

  // 8) Humidity extremes
  if (humidity !== undefined && humidity > 90) {
    return t('Forecast.humidity90+');
  }
  if (humidity !== undefined && humidity < 30) {
    return t('Forecast.humidity30-');
  }

  // 9) Default clear sky
  if (main === 'Clear') {
    return t('Forecast.clearSky');
  }

  // 10) Final fallback
  return t('Forecast.fallback');
}
type Main =
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Thunderstorm'
  | 'Snow'
  | 'Mist'
  | 'Haze'
  | 'Fog'
  | 'Drizzle'
  | 'Dust'
  | 'Tornado';

/**
 * Normalizes the "main" weather from either the OpenWeather `descricao` (EN)
 * or the localized `condicao` (PT). Prefer `descricao` when valid.
 */
function normalizeMain(descricao?: string, condicao?: string): Main | undefined {
  const known: Set<Main> = new Set([
    'Clear',
    'Clouds',
    'Rain',
    'Thunderstorm',
    'Snow',
    'Mist',
    'Haze',
    'Fog',
    'Drizzle',
    'Dust',
    'Tornado',
  ]);

  const d = descricao?.trim();
  if (d && known.has(d as Main)) return d as Main;

  const c = condicao?.toLowerCase();
  if (!c) return undefined;

  if (c.includes('céu limpo')) return 'Clear';
  if (c.includes('nublado') || c.includes('parcialmente nublado')) return 'Clouds';
  if (c.includes('chuva') || c.includes('garoa')) return 'Rain';
  if (c.includes('trovoada') || c.includes('tempestade')) return 'Thunderstorm';
  if (c.includes('neve')) return 'Snow';
  if (c.includes('névoa') || c.includes('nevoeiro')) return 'Fog';

  return undefined;
}
