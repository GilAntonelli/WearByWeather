// services/weatherPhrases.ts
import { TFunction } from 'i18next';

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
export function getFraseClimatica(t: TFunction, {
  temperatura,
  condicao,
  descricao,
  chuva,
  vento,
  umidade
}: Clima): string {

  // 🌧️ Chuva
  if (chuva && temperatura < 15) {
    return t('Forecast.rainTemperature15-');
  }

  if (chuva) {
    return t('Forecast.rain');
  }

  // 🌬️ Vento
  if (vento !== undefined && vento > 30) {
    return t('Forecast.wind30+');
  }

  if (vento !== undefined && vento > 20) {
    return t('Forecast.wind20+');
  }

  // ☀️ Calor
  if (descricao === 'Clear' && temperatura >= 35) {
    return t('Forecast.temperature35+');
  }

  if (descricao === 'Clear' && temperatura > 30) {
    return t('Forecast.temperature30+');
  }

  // ❄️ Frio
  if (descricao === 'Clear' && temperatura <= 5) {
    return t('Forecast.clearSkyCold5-');
  }

  if (temperatura <= 5) {
    return t('Forecast.cold5-');
  }

  if (temperatura < 10) {
    return t('Forecast.temperature10-');
  }

  // ☁️ Nuvens e neblina
  if (descricao === 'Clouds' && temperatura < 15) {
    return t('Forecast.cloudsTemperature15-');
  }

  if (descricao === 'Clouds') {
    return t('Forecast.clouds');
  }

  if (descricao === 'Fog' || condicao?.includes('nevoeiro')) {
    return t('Forecast.fog');
  }

  if (descricao === 'Mist') {
    return t('Forecast.mist');
  }

  // 💧 Umidade
  if (umidade !== undefined && umidade > 90) {
    return t('Forecast.humidity90+');
  }

  if (umidade !== undefined && umidade < 30) {
    return t('Forecast.humidity30-');
  }

  // ☀️ Céu limpo padrão
  if (descricao === 'Clear') {
    return t('Forecast.clearSky');
  }

  // 🟡 Fallback final
  return t('Forecast.fallback');
}
