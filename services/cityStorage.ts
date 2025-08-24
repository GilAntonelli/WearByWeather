// services/cityStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDetectedCity } from './LocationService';

export type ResolvedCity = {
  raw: string;      // usado na API (OpenWeather)
  label: string;    // mostrado na UI
  source: 'saved' | 'detected' | 'fallback';
};

export async function resolveInitialCity(options?: {
  preferDetection?: boolean;
  fallback?: { raw: string; label: string };
}): Promise<ResolvedCity> {
  const preferDetection = options?.preferDetection ?? true;
  const fallback = options?.fallback ?? { raw: 'Lisbon', label: 'Lisboa' };

  const saved = await AsyncStorage.getItem('lastCity');
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as any;
      const raw = parsed?.raw ?? parsed?.label ?? String(saved);
      const label = parsed?.label ?? parsed?.raw ?? String(saved);
      return { raw, label, source: 'saved' };
    } catch {
      return { raw: saved, label: saved, source: 'saved' };
    }
  }

  if (preferDetection) {
    try {
      const detected = await getDetectedCity({ fallbackLabel: undefined });
      if (detected) return { raw: detected, label: detected, source: 'detected' };
    } catch {
      // ignore
    }
  }

  return { raw: fallback.raw, label: fallback.label, source: 'fallback' };
}

export async function saveCity(raw: string, label?: string) {
  await AsyncStorage.setItem('lastCity', JSON.stringify({ raw, label: label ?? raw }));
}
