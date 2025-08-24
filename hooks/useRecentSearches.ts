// hooks/useRecentSearches.ts
import { useCallback, useEffect, useState } from 'react';
import {
  RecentCity,
  getRecentCities,
  addRecentCity as svcAdd,
  removeRecentCity as svcRemove,
  clearRecentCities as svcClear
} from '../services/recentSearches';

export function useRecentSearches() {
  const [recents, setRecents] = useState<RecentCity[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await getRecentCities();
    setRecents(data);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const addRecentCity = useCallback(async (city: Omit<RecentCity, 'savedAt'>) => {
    const next = await svcAdd(city);
    setRecents(next);
  }, []);

  const removeRecentCity = useCallback(async (city: RecentCity) => {
    const next = await svcRemove(city);
    setRecents(next);
  }, []);

  const clearRecentCities = useCallback(async () => {
    await svcClear();
    setRecents([]);
  }, []);

  return {
    recents,
    loading,
    reload,
    addRecentCity,
    removeRecentCity,
    clearRecentCities,
  };
}
