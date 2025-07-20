import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeatherByCity } from '../services/weatherService';
import { API_KEY, GEO_URL } from '../config/apiConfig';
import { getPreferredCityName } from '../utils/getPreferredCityName';
import * as Location from 'expo-location';
import { getdetectedCity } from '../services/LocationService';
import { formatLocationName } from '../utils/formatLocation';
import { useTranslation } from 'react-i18next';

interface CitySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
}

interface Suggestion {
  name: string;
  country?: string;
  state?: string;
}

export const CitySelectorModal = ({
  visible,
  onClose,
  onSelect,
}: CitySelectorModalProps) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    };

    checkPermission();
  }, [visible]);

  const cityList: Suggestion[] = [
    { name: 'Lisboa', state: 'Lisboa', country: 'Portugal' },
    { name: 'Porto', state: 'Porto', country: 'Portugal' },
    { name: 'Madrid', state: 'Comunidad de Madrid', country: 'Espanha' },
    { name: 'Barcelona', state: 'Catalunha', country: 'Espanha' },
    { name: 'Paris', state: 'Île-de-France', country: 'França' },
    { name: 'Londres', state: 'Inglaterra', country: 'Reino Unido' },
    { name: 'Berlim', state: 'Berlim', country: 'Alemanha' },
    { name: 'Roma', state: 'Lácio', country: 'Itália' },
    { name: 'Bruxelas', state: 'Bruxelas', country: 'Bélgica' },
    { name: 'Amsterdã', state: 'Holanda do Norte', country: 'Países Baixos' },
    { name: 'São Paulo', state: 'SP', country: 'Brasil' },
    { name: 'Rio de Janeiro', state: 'RJ', country: 'Brasil' },
  ];

  const fullCityList: Suggestion[] = hasLocationPermission
    ? [{ name:  t('cityModal.currentLocation') }, ...cityList]
    : cityList;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${GEO_URL}/direct?q=${encodeURIComponent(search)}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error('Erro ao buscar sugestões:', err);
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

    let label = '';
    let nomeParaApi = '';

    if (selectedItem.name === t('cityModal.currentLocation')) {
      const detectedCity = await getdetectedCity();
      if (!detectedCity) {
        Alert.alert(t('alerts.typeError'), t('alerts.localizationAlert'));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${GEO_URL}/direct?q=${encodeURIComponent(detectedCity)}&limit=1&appid=${API_KEY}`
        );
        const data = await response.json();
        const full = data[0];

        const displayName = getPreferredCityName(full);
        label = formatLocationName(displayName, full.state, full.country);
        nomeParaApi = full.name;
      } catch (err) {
        console.error('Erro ao obter info da localização atual:', err);
        label = detectedCity;
        nomeParaApi = detectedCity;
      }
    } else {
      const displayName = getPreferredCityName(selectedItem);
      label = formatLocationName(displayName, selectedItem.state, selectedItem.country);
      nomeParaApi = selectedItem.name;
    }

    const clima = await getWeatherByCity(nomeParaApi);
    setLoading(false);

    if (!clima) {
      Alert.alert(t('alerts.typeInvalidCity'), t('alerts.invalidCityAlert'));
      return;
    }

    await AsyncStorage.setItem('lastCity', JSON.stringify({ label, raw: nomeParaApi }));
    onSelect(label);
    onClose();
  };

   return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <View style={{ paddingHorizontal: 16, paddingTop: 8, marginBottom: 13 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 44,
              }}
            >
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
                  placeholder={t('cityModal.searchPlaceholder')}
                  value={search}
                  onChangeText={setSearch}
                  autoFocus
                  style={{
                    flex: 1,
                    color: theme.colors.textMedium,
                    fontSize: 16,
                    paddingVertical: 0,
                  }}
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
                style={{
                  marginLeft: 4,
                  height: 18,
                  justifyContent: 'center',
                  paddingHorizontal: 4,
                }}
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
              data={search.length < 3 ? fullCityList : results}
              keyExtractor={(item, index) =>
                `${item.name}-${item.state ?? ''}-${item.country ?? ''}-${index}`
              }
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 16 }}
              renderItem={({ item }) => {
                const isFromSearch = search.length >= 3;
                const label =
                  item.name === t('cityModal.currentLocation')
                    ? item.name
                    : isFromSearch
                      ? `${getPreferredCityName(item)}, ${item.state ?? ''}, ${item.country ?? ''}`
                      : formatLocationName(getPreferredCityName(item), item.state, item.country);
                return (
                  <TouchableOpacity
                    style={globalStyles.cityItem}
                    onPress={() => handleSelectCity(item)}
                  >
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
