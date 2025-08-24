// services/recentSearches.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENTS_KEY = '@ww_recent_cities_v1';

export type RecentCity = {
  id?: number;                 // from OpenWeather geocoding (if provided)
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  displayLabel: string;        // e.g. "Lisbon, Lisbon, Portugal"
  savedAt: number;             // unix ms
};

function roundCoord(n: number, p = 3) {
  const f = Math.pow(10, p);
  return Math.round(n * f) / f;
}

function sameCity(a: RecentCity, b: RecentCity): boolean {
  if (a.id && b.id) return a.id === b.id;
  return (
    roundCoord(a.lat) === roundCoord(b.lat) &&
    roundCoord(a.lon) === roundCoord(b.lon)
  );
}

export async function getRecentCities(): Promise<RecentCity[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentCity[];
    // defensive sort (newest first)
    return parsed.sort((x, y) => y.savedAt - x.savedAt).slice(0, 3);
  } catch {
    return [];
  }
}

export async function addRecentCity(input: Omit<RecentCity, 'savedAt'>): Promise<RecentCity[]> {
  const current = await getRecentCities();
  const toInsert: RecentCity = { ...input, savedAt: Date.now() };

  const deduped = current.filter(c => !sameCity(c, toInsert));
  const next = [toInsert, ...deduped].slice(0, 3);

  await AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  return next;
}

export async function removeRecentCity(target: RecentCity): Promise<RecentCity[]> {
  const current = await getRecentCities();
  const next = current.filter(c => !sameCity(c, target));
  await AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  return next;
}

export async function clearRecentCities(): Promise<void> {
  await AsyncStorage.removeItem(RECENTS_KEY);
}
