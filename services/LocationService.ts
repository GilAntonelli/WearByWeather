// services/LocationService.ts
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Coords = { latitude: number; longitude: number };
export type DetectedPlace = {
  city: string;
  district?: string | null;
  region?: string | null;
  country?: string | null;
  coords: Coords;
};

const CACHE_KEY = '@detected_city_v1';
const DEFAULT_FALLBACK_CITY = 'Unknown city';
const DEFAULT_TIMEOUT_MS = 8000;
const MAX_CACHE_AGE_MS = 30 * 60 * 1000; // 30 minutes
const MIN_MOVEMENT_TO_REFRESH_M = 500; // refresh if user moved > 500m

function timeout<T>(p: Promise<T>, ms = DEFAULT_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('LOCATION_TIMEOUT')), ms)
    ) as Promise<T>,
  ]);
}

function haversineMeters(a: Coords, b: Coords): number {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Prefer local neighborhood/district when preferLocal=true (e.g., "Sacavém"),
 * otherwise prefer city (e.g., "Lisboa").
 */
function extractPlaceLabel(
  addr: Location.LocationGeocodedAddress,
  opts: { preferLocal?: boolean; fallback?: string } = {}
): string {
  const fallback = opts.fallback ?? DEFAULT_FALLBACK_CITY;
  const { city, district, subregion, region, name } = addr;

  if (opts.preferLocal) {
    // Try to surface smaller administrative areas first
    return district || name || city || subregion || region || fallback;
  }

  return city || district || subregion || region || name || fallback;
}

export async function ensureLocationPermission(): Promise<boolean> {
  const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
  if (status === Location.PermissionStatus.GRANTED) return true;
  if (!canAskAgain) return false;
  const req = await Location.requestForegroundPermissionsAsync();
  return req.status === Location.PermissionStatus.GRANTED;
}

/**
 * Picks a good set of coordinates:
 * - Uses last known if it's recent and accurate enough (fast & battery friendly).
 * - Otherwise requests a fresh reading with the appropriate accuracy.
 */
async function getBestCoords(options?: {
  desiredAccuracyMeters?: number;   // target accuracy, e.g. 30–50 m
  lastKnownMaxAgeMs?: number;       // accept last-known up to N ms old (default 5 min)
  forceFresh?: boolean;             // ignore last-known and measure now
}): Promise<Coords | null> {
  const desired = options?.desiredAccuracyMeters ?? 50;
  const lastMaxAge = options?.lastKnownMaxAgeMs ?? 5 * 60 * 1000;

  const accuracyEnum =
    desired <= 25
      ? Location.Accuracy.Highest
      : desired <= 50
      ? Location.Accuracy.High
      : Location.Accuracy.Balanced;

  // 1) Try last known if not forcing a fresh reading
  if (!options?.forceFresh) {
    const last = await Location.getLastKnownPositionAsync();
    if (last) {
      const ts =
        typeof last.timestamp === 'number'
          ? last.timestamp
          : (last as any).timestamp?.getTime?.() ?? Date.now();
      const age = Date.now() - ts;
      const accMeters = last.coords.accuracy ?? Infinity;

      // Accept only if it's recent and reasonably accurate
      if (age <= lastMaxAge && accMeters <= desired * 2) {
        return {
          latitude: last.coords.latitude,
          longitude: last.coords.longitude,
        };
      }
    }
  }

  // 2) Fresh reading with requested accuracy
  const current = await timeout(
    Location.getCurrentPositionAsync({ accuracy: accuracyEnum })
  );

  return {
    latitude: current.coords.latitude,
    longitude: current.coords.longitude,
  };
}

/**
 * Returns the detected city-like label as a string.
 * - Caches for 30 min and reuses if the user hasn't moved much (< 500m).
 * - Robust fallbacks when permission is denied or geocoding fails.
 * - Options allow finer control over accuracy and locality preference.
 */
export async function getDetectedCity(options?: {
  useCache?: boolean;
  maxCacheAgeMs?: number;
  fallbackLabel?: string;

  // Granularity & accuracy controls
  preferLocal?: boolean;            // true → prefer district/neighborhood (e.g., "Sacavém")
  desiredAccuracyMeters?: number;   // default 50 (requests High accuracy)
  lastKnownMaxAgeMs?: number;       // default 5min for last-known acceptance
  forceFresh?: boolean;             // true → skip last-known and read fresh now
}): Promise<string> {
  const useCache = options?.useCache ?? true;
  const maxAge = options?.maxCacheAgeMs ?? MAX_CACHE_AGE_MS;
  const fallback = options?.fallbackLabel ?? DEFAULT_FALLBACK_CITY;

  const preferLocal = options?.preferLocal ?? true;
  const desiredAcc = options?.desiredAccuracyMeters ?? 50;
  const lastKnownMaxAgeMs = options?.lastKnownMaxAgeMs ?? 5 * 60 * 1000;
  const forceFresh = options?.forceFresh ?? false;

  // 1) Permissions
  const ok = await ensureLocationPermission();
  if (!ok) {
    if (useCache) {
      const cachedRaw = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        try {
          const cached = JSON.parse(cachedRaw) as { place: DetectedPlace; ts: number };
          return cached.place.city || fallback;
        } catch {}
      }
    }
    return fallback;
  }

  // 2) Load cache if available
  let cached: { place: DetectedPlace; ts: number } | null = null;
  if (useCache) {
    const cachedRaw = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      try {
        cached = JSON.parse(cachedRaw);
      } catch {
        cached = null;
      }
    }
  }

  // 3) Get coordinates (with accuracy/recency preferences)
  const coords =
    (await getBestCoords({
      desiredAccuracyMeters: desiredAcc,
      lastKnownMaxAgeMs,
      forceFresh,
    })) ?? null;

  if (!coords) {
    return cached?.place.city ?? fallback;
  }

  // 4) If cache is fresh and user hasn't moved much, reuse it
  if (cached) {
    const age = Date.now() - cached.ts;
    const moved = haversineMeters(cached.place.coords, coords);
    if (age <= maxAge && moved < MIN_MOVEMENT_TO_REFRESH_M) {
      return cached.place.city;
    }
  }

  // 5) Reverse geocode
  try {
    const results = await timeout(Location.reverseGeocodeAsync(coords));
    const first = results[0];
    if (first) {
      const cityLabel = extractPlaceLabel(first, { preferLocal, fallback });

      const place: DetectedPlace = {
        city: cityLabel,
        district: first.district ?? null,
        region: first.region ?? first.subregion ?? null,
        country: first.country ?? null,
        coords,
      };
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ place, ts: Date.now() })
      );
      console.log('Detected city:', cityLabel);
      return cityLabel;
    }
  } catch (err) {
    console.warn('reverseGeocode error', err);
  }

  // 6) Fallback to cache or default
  return cached?.place.city ?? fallback;
}

// Temporary backward-compat export (so existing imports won't break)
export const getdetectedCity = getDetectedCity;
