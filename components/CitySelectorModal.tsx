// components/CitySelectorModal.tsx
import React, { useEffect, useState } from 'react';

import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  Linking,
  ScrollView,
} from 'react-native';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeatherByCity } from '../services/weatherService';
import { API_KEY, GEO_URL } from '../config/apiConfig';
import { getPreferredCityName } from '../utils/getPreferredCityName';
import { getDetectedCity } from '../services/LocationService';
import { formatLocationName } from '../utils/formatLocation';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';

interface CitySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
  showCancel?: boolean;
}

interface Suggestion {
  name: string;
  country?: string;
  state?: string;
  apiName?: string;
  id?: number | string;
  lat?: number;
  lon?: number;
}

export const CitySelectorModal = ({
  visible,
  onClose,
  onSelect,
  showCancel = true,
}: CitySelectorModalProps) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { recents, addRecentCity, clearRecentCities } = useRecentSearches();
  // Canonical static cities (stable ids + API names)
  type StaticCity = { id: string; apiName: string };
  const STATIC_CITIES: StaticCity[] = [
    { id: 'lisbon', apiName: 'Lisbon' },
    { id: 'porto', apiName: 'Porto' },
    { id: 'madrid', apiName: 'Madrid' },
    { id: 'barcelona', apiName: 'Barcelona' },
    { id: 'paris', apiName: 'Paris' },
    { id: 'london', apiName: 'London' },
    { id: 'berlin', apiName: 'Berlin' },
    { id: 'rome', apiName: 'Rome' },
    { id: 'brussels', apiName: 'Brussels' },
    { id: 'amsterdam', apiName: 'Amsterdam' },
    { id: 'sao_paulo', apiName: 'Sao Paulo' },
    { id: 'rio', apiName: 'Rio de Janeiro' },
  ];
  // Build localized suggestions for UI
  const buildLocalizedStaticList = (): Suggestion[] =>
    STATIC_CITIES.map((c) => ({
      id: c.id,
      apiName: c.apiName,
      name: t(`cities.${c.id}.name`) as string,
      state: t(`cities.${c.id}.state`) as string,
      country: t(`cities.${c.id}.country`) as string,
    }));

  // Always prepend the sentinel ("Use current location")
  const fullCityList: Suggestion[] = [
    { id: ':current', name: t('cityModal.currentLocation') as string },
    ...buildLocalizedStaticList(),
  ];

  // Debounced search against OpenWeather Geocoding
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${GEO_URL}/direct?q=${encodeURIComponent(search.trim())}&limit=5&appid=${API_KEY}`
        );
        const data = (await response.json()) as any[];
        const mapped: Suggestion[] = Array.isArray(data)
          ? data.map((d) => ({
            name: d?.name,
            id: d?.id,
            state: d?.state,
            country: d?.country,
            lat: d?.lat,
            lon: d?.lon,
          }))
          : [];
        setResults(mapped);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounce);
  }, [search]);

  // REPLACE the whole function
  const handleSelectCity = async (selectedItem: Suggestion) => {
    setLoading(true);
    try {
      let label = '';
      let nomeParaApi = '';

      const sentinelLabel = t('cityModal.currentLocation') as string;
      const FALLBACK_SENTINEL = '__WW_UNKNOWN_CITY__';

      if (selectedItem.name === sentinelLabel) {
        // ---- Current location flow ----
        const detectedCity = await getDetectedCity({
          fallbackLabel: FALLBACK_SENTINEL,
          preferLocal: true,
          desiredAccuracyMeters: 30,
          lastKnownMaxAgeMs: 2 * 60 * 1000,
          forceFresh: false,
        });

        if (detectedCity === FALLBACK_SENTINEL) {
          const perm = await Location.getForegroundPermissionsAsync();
          const servicesOn = await Location.hasServicesEnabledAsync();

          if (perm.status !== Location.PermissionStatus.GRANTED) {
            Alert.alert(
              t('alerts.typePermission'),
              t('alerts.detectCityAlert'),
              [
                { text: t('alerts.cancelbutton'), style: 'cancel' },
                { text: t('alerts.text'), onPress: () => Linking.openSettings() },
              ],
              { cancelable: true }
            );
          } else if (!servicesOn) {
            Alert.alert(t('alerts.typeAttention'), t('alerts.localizationAlert'));
          } else {
            Alert.alert(t('alerts.typeError'), t('alerts.localizationAlert'));
          }
          return;
        }

        // Geocode detected city
        try {
          const response = await fetch(
            `${GEO_URL}/direct?q=${encodeURIComponent(detectedCity)}&limit=1&appid=${API_KEY}`
          );
          const data = await response.json();
          const full = data?.[0];

          if (!full?.name) {
            Alert.alert(t('alerts.typeInvalidCity'), t('alerts.invalidCityAlert'));
            return;
          }

          const displayName = getPreferredCityName(full);
          label = formatLocationName(displayName, full.state, full.country);
          nomeParaApi = full.name;

          // Validate weather BEFORE saving recents
          let weather: any = null;
          try { weather = await getWeatherByCity(nomeParaApi); } catch { weather = null; }
          if (!weather) {
            Alert.alert(t('alerts.typeInvalidCity'), t('alerts.invalidCityAlert'));
            return;
          }

          // Save to recents AFTER weather success
          try {
            await addRecentCity({
              id: full?.id,
              name: full?.name,
              state: full?.state,
              country: full?.country,
              lat: full?.lat,
              lon: full?.lon,
              displayLabel: label,
            });
          } catch { /* no-op */ }

        } catch {
          Alert.alert(t('alerts.typeError'), t('alerts.localizationAlert'));
          return;
        }

      } else {
        // ---- Static list or search result flow ----
        const displayName = getPreferredCityName(selectedItem);
        label = formatLocationName(displayName, selectedItem.state, selectedItem.country);
        nomeParaApi = selectedItem.apiName || selectedItem.name;

        // Validate weather BEFORE saving recents
        let weather: any = null;
        try { weather = await getWeatherByCity(nomeParaApi); } catch { weather = null; }
        if (!weather) {
          Alert.alert(t('alerts.typeInvalidCity'), t('alerts.invalidCityAlert'));
          return;
        }

        // Save to recents
        if (typeof selectedItem.lat === 'number' && typeof selectedItem.lon === 'number') {
          // Search result already has coordinates
          try {
            await addRecentCity({
              id: typeof selectedItem.id === 'number' ? selectedItem.id : undefined,
              name: selectedItem.name,
              state: selectedItem.state,
              country: selectedItem.country!,
              lat: selectedItem.lat!,
              lon: selectedItem.lon!,
              displayLabel: label,
            });
          } catch { /* no-op */ }
        } else {
          // Static city: resolve coordinates via geocoding
          try {
            const geoResp = await fetch(
              `${GEO_URL}/direct?q=${encodeURIComponent(nomeParaApi)}&limit=1&appid=${API_KEY}`
            );
            const geoData = await geoResp.json();
            const g = geoData?.[0];
            if (g?.lat && g?.lon) {
              await addRecentCity({
                id: g?.id,
                name: g?.name || selectedItem.name,
                state: g?.state ?? selectedItem.state,
                country: g?.country ?? selectedItem.country,
                lat: g.lat,
                lon: g.lon,
                displayLabel: label,
              });
            }
          } catch { /* no-op */ }
        }
      }

      // Persist last city + close
      await AsyncStorage.setItem('lastCity', JSON.stringify({ label, raw: nomeParaApi }));
      onSelect(label);
      onClose();

    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <View style={{ paddingHorizontal: 16, paddingTop: 8, marginBottom: 13 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 44 }}>
              <View
                style={[
                  globalStyles.fakeSearchInput,
                  {
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: '#F0F0F0',
                  },
                ]}
              >
                <Ionicons name="search" size={20} color={theme.colors.textLight} style={{ marginRight: 8 }} />
                <TextInput
                  placeholder={t('cityModal.searchPlaceholder') as string}
                  value={search}
                  onChangeText={setSearch}
                  autoFocus
                  style={{ flex: 1, color: theme.colors.textMedium, fontSize: 16, paddingVertical: 0 }}
                  placeholderTextColor={theme.colors.textLight}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={18} color={theme.colors.textLight} />
                  </TouchableOpacity>
                )}
              </View>
              {showCancel && (
                <TouchableOpacity
                  onPress={onClose}
                  style={{ marginLeft: 4, height: 18, justifyContent: 'center', paddingHorizontal: 4 }}
                >
                  <Text
                    style={{
                      color: theme.colors.textLight,
                      fontSize: 16,
                      fontWeight: '500',
                      lineHeight: 15,
                      paddingVertical: 13,
                      includeFontPadding: false,
                      textAlignVertical: 'center',
                    }}
                  >
                    {t('alerts.cancelbutton')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {search.trim().length < 3 && recents.length > 0 && (
            <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textDark }}>
                  {t('CitySelector.recentTitle', 'Recent searches')}
                </Text>
                <TouchableOpacity
                  onPress={clearRecentCities}
                  accessibilityLabel={t('CitySelector.clearRecentsA11y', 'Clear recent searches')}
                >
                  <Text style={{ fontSize: 13, textDecorationLine: 'underline', color: theme.colors.textLight }}>
                    {t('CitySelector.clearRecents', 'Clear')}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
                {recents.map((c, i) => (
                  <TouchableOpacity
                    key={`${c.id ?? `${c.lat},${c.lon},${c.name}`}`}
                    onPress={() =>
                      // Reutiliza o mesmo handler, reconstruindo uma Suggestion compatível
                      handleSelectCity({
                        id: c.id,
                        name: c.name,
                        state: c.state,
                        country: c.country,
                        apiName: c.name,
                        lat: c.lat,
                        lon: c.lon,
                      })
                    }
                    style={{
                      paddingHorizontal: 12,
                      height: 32,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FFFFFF',
                      marginRight: 8, // spacing between chips
                    }}
                  >
                    <Text style={{ fontSize: 13, color: theme.colors.textMedium }} numberOfLines={1}>
                      {c.displayLabel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}


          {loading ? (
            <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 32 }} />
          ) : (
            <FlatList
              data={
                search.trim().length < 3
                  ? fullCityList
                  : [{ name: t('cityModal.currentLocation') as string }, ...results]
              }
              keyExtractor={(item, index) =>
                `${item.name}-${item.state ?? ''}-${item.country ?? ''}-${index}`
              }
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16 }}
              renderItem={({ item }) => {
                const isFromSearch = search.trim().length >= 3;
                const label =
                  item.name === (t('cityModal.currentLocation') as string)
                    ? item.name
                    : isFromSearch
                      ? `${[getPreferredCityName(item), item.state, item.country].map(p => (p ?? '').trim()).filter(Boolean).join(', ')}`
                      : formatLocationName(getPreferredCityName(item), item.state, item.country);

                return (
                  <TouchableOpacity style={globalStyles.cityItem} onPress={() => handleSelectCity(item)}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={theme.colors.primary}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={globalStyles.cityName}>{label}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
