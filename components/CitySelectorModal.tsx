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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeatherByCity } from '../services/weatherService';
import { API_KEY, GEO_URL } from '../config/apiConfig';
import { getPreferredCityName } from '../utils/getPreferredCityName';
import { getdetectedCity } from '../services/LocationService';
import { formatLocationName } from '../utils/formatLocation';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';

interface CitySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
}

interface Suggestion {
  name: string;           // localized label for UI
  country?: string;       // localized
  state?: string;         // localized
  apiName?: string;       // canonical name for API (usually English)
  id?: string;            // optional stable id (e.g., 'lisbon')
}
export const CitySelectorModal = ({
  visible,
  onClose,
  onSelect,
}: CitySelectorModalProps) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

// Canonical static cities (stable ids + API names)
type StaticCity = { id: string; apiName: string };
const STATIC_CITIES: StaticCity[] = [
  { id: 'lisbon',      apiName: 'Lisbon' },
  { id: 'porto',       apiName: 'Porto' },
  { id: 'madrid',      apiName: 'Madrid' },
  { id: 'barcelona',   apiName: 'Barcelona' },
  { id: 'paris',       apiName: 'Paris' },
  { id: 'london',      apiName: 'London' },
  { id: 'berlin',      apiName: 'Berlin' },
  { id: 'rome',        apiName: 'Rome' },
  { id: 'brussels',    apiName: 'Brussels' },
  { id: 'amsterdam',   apiName: 'Amsterdam' },
  { id: 'sao_paulo',   apiName: 'Sao Paulo' },
  { id: 'rio',         apiName: 'Rio de Janeiro' },
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
              state: d?.state,
              country: d?.country,
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

  const handleSelectCity = async (selectedItem: Suggestion) => {
    setLoading(true);
    try {
      let label = '';
      let nomeParaApi = '';

      const sentinelLabel = t('cityModal.currentLocation') as string;
      const FALLBACK_SENTINEL = '__WW_UNKNOWN_CITY__'; // fixed sentinel to avoid i18n coupling

      if (selectedItem.name === sentinelLabel) {
        // Detect location; if permission is denied, service returns the sentinel
        const detectedCity = await getdetectedCity({
          fallbackLabel: FALLBACK_SENTINEL,
          preferLocal: true,
          desiredAccuracyMeters: 30,
          lastKnownMaxAgeMs: 2 * 60 * 1000,
          forceFresh: false,
        });

        // If fallback (permission denied / no coords), decide which alert to show under alerts.*
        if (detectedCity === FALLBACK_SENTINEL) {
          const perm = await Location.getForegroundPermissionsAsync();
          const servicesOn = await Location.hasServicesEnabledAsync();

          if (perm.status !== Location.PermissionStatus.GRANTED) {
            // Permission denied → show "typePermission" + "detectCityAlert" with a button to open settings
            Alert.alert(
              t('alerts.typePermission'),
              t('alerts.detectCityAlert'),
              [
                { text: t('alerts.cancelbutton'), style: 'cancel' },
                { text: t('alerts.text'), onPress: () => Linking.openSettings() }, // "Abrir Configurações"
              ],
              { cancelable: true }
            );
          } else if (!servicesOn) {
            // Services (GPS) off → show generic localization alert
            Alert.alert(t('alerts.typeAttention'), t('alerts.localizationAlert'));
          } else {
            // Any other cause → generic
            Alert.alert(t('alerts.typeError'), t('alerts.localizationAlert'));
          }
          return;
        }

        // Resolve detectedCity via geocoding (to normalize state/country)
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
        } catch {
          Alert.alert(t('alerts.typeError'), t('alerts.localizationAlert'));
          return;
        }
      } else {
        // Static/searched city
const displayName = getPreferredCityName(selectedItem);
label = formatLocationName(displayName, selectedItem.state, selectedItem.country);
// Use canonical apiName if present; fallback to name
nomeParaApi = selectedItem.apiName || selectedItem.name;
      }

      // Validate city by fetching its weather (guard against throws)
      let weather: any = null;
      try {
        weather = await getWeatherByCity(nomeParaApi);
      } catch {
        weather = null;
      }

      if (!weather) {
        Alert.alert(t('alerts.typeInvalidCity'), t('alerts.invalidCityAlert'));
        return;
      }

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
            </View>
          </View>

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
                      ? `${getPreferredCityName(item)}, ${item.state ?? ''}, ${item.country ?? ''}`
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
