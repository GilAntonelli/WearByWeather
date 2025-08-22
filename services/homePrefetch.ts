// services/homePrefetch.ts
import { Image, ImageSourcePropType } from 'react-native';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeatherByCity } from './weatherService';
import { getSuggestionByWeather } from './suggestionEngine';

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
    rainMM?: number; // NEW: precipitation volume in mm

  };
  suggestion: any;
};

let inMemoryCache: HomePrefetchData | null = null;

export function getCachedHomeData(): HomePrefetchData | null {
  return inMemoryCache;
}

export function clearCachedHomeData(): void {
  inMemoryCache = null;
}

async function prefetchImageSource(src: ImageSourcePropType): Promise<void> {
  try {
    if (typeof src === 'number') {
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
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        await Image.prefetch(uri);
        return;
      }
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
    console.log('Error reading lastCity from storage, using provided city:', city);
    // ignore normalization errors; we still try with provided "city"
  }

  const weather = await getWeatherByCity(raw);
  if (!weather || typeof weather.temperatura !== 'number') {
    throw new Error('Weather not available or invalid');
  }

  const clima = {
    ...weather,
    genero: prefs.gender,
    rainMM: weather.rainMM ?? 0,
    conforto: prefs.comfort,
    t,
  };

  const suggestion = getSuggestionByWeather(clima);

  if (suggestion?.image) {
    await prefetchImageSource(suggestion.image as ImageSourcePropType);
  }

  inMemoryCache = { weather, suggestion };
  return inMemoryCache;
}