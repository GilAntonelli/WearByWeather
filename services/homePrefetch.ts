// services/homePrefetch.ts
// Purpose: Preload Home screen data (weather + look suggestion) and avatar image to avoid visible loading flicker.

import { Image, ImageSourcePropType } from 'react-native';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeatherByCity } from './weatherService';
import { getSuggestionByWeather } from './suggestionEngine';

// Align this with your actual LookSuggestion type if available.
export type HomePrefetchData = {
  weather: {
    temperatura: number;
    sensacaoTermica: number;
    condicao?: string;
    chuva?: boolean;
    vento?: number;
    icon?: string;
    tempMin?: number;
    tempMax?: number;
    id?: number;
  };
  suggestion: any; // replace with LookSuggestion if you have the type
};

// ---- In-memory cache so Home can render instantly when regaining focus ----
let inMemoryCache: HomePrefetchData | null = null;

export function getCachedHomeData(): HomePrefetchData | null {
  return inMemoryCache;
}

export function clearCachedHomeData(): void {
  inMemoryCache = null;
}

// ---- Helper: prefetch any React Native image source (require, {uri}, or array) ----
async function prefetchImageSource(src: ImageSourcePropType): Promise<void> {
  try {
    if (typeof src === 'number') {
      // Local asset from require('...'): RN turns it into a numeric module id
      await Asset.fromModule(src).downloadAsync();
      return;
    }

    if (Array.isArray(src)) {
      await Promise.all(src.map(s => prefetchImageSource(s)));
      return;
    }

    const maybe = src as { uri?: string };
    if (maybe?.uri) {
      const uri = maybe.uri;
      // Remote URL: prefetch via Image.prefetch
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        await Image.prefetch(uri);
        return;
      }
      // Local/asset file URI
      await Asset.fromURI(uri).downloadAsync();
    }
  } catch {
    // Best-effort prefetch; ignore errors
  }
}

/**
 * Preloads weather + suggestion for the given city and user preferences.
 * - Normalizes city from AsyncStorage 'lastCity' if needed (handles {raw,label}).
 * - Fetches weather and computes suggestion.
 * - Prefetches avatar image (require(...) or { uri }) to avoid late image popping.
 * - Stores result in an in-memory cache for instant render on Home.
 *
 * @param city    Raw or label city string. If mismatched, 'lastCity' from storage is used.
 * @param prefs   { gender, comfort } using canonical keys: 'male'|'female'|'unisex', 'feel_cold'|'neutral'|'feel_hot'
 * @param t       i18n translation function (pass the same t used by screens)
 * @returns       HomePrefetchData with weather and suggestion
 */
export async function prefetchHomeData(
  city: string,
  prefs: { gender: string; comfort: string },
  t: any
): Promise<HomePrefetchData> {
  // 1) Normalize city (support stored shape { raw, label })
  let raw = city;
  try {
    const savedCity = await AsyncStorage.getItem('lastCity');
    if (savedCity) {
      try {
        const parsed = JSON.parse(savedCity);
        raw = (parsed?.raw as string) || (parsed?.label as string) || savedCity;
      } catch {
        raw = savedCity;
      }
    }
  } catch {
    // ignore normalization errors; we still try with provided "city"
  }

  // 2) Fetch weather
  const weather = await getWeatherByCity(raw);
  if (!weather || typeof weather.temperatura !== 'number') {
    throw new Error('Weather not available or invalid');
  }

  // 3) Build context for suggestion engine
  const clima = {
    ...weather,
    genero: prefs.gender,  // keep these keys aligned with your engine
    conforto: prefs.comfort,
    t,
  };

  // 4) Compute suggestion
  const suggestion = getSuggestionByWeather(clima);

  // 5) Prefetch avatar image (supports require(...) and { uri })
  if (suggestion?.image) {
    await prefetchImageSource(suggestion.image as ImageSourcePropType);
  }

  // 6) Save in-memory for instant render on Home
  inMemoryCache = { weather, suggestion };
  return inMemoryCache;
}