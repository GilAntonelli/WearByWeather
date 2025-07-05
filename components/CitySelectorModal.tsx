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
    ? [{ name: 'Localização atual' }, ...cityList]
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

    if (selectedItem.name === 'Localização atual') {
      const detectedCity = await getdetectedCity();
      if (!detectedCity) {
        Alert.alert('Erro', 'Não foi possível detectar sua localização.');
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
      Alert.alert('Cidade inválida', 'Não foi possível obter dados climáticos para esta cidade.');
      return;
    }

    await AsyncStorage.setItem('lastCity', JSON.stringify({ label, raw: nomeParaApi }));
    onSelect(label);
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={globalStyles.overlay} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 16,
          maxHeight: '90%',
        }}
      >
        <Text style={globalStyles.title}>Escolha uma cidade</Text>

        <TextInput
          placeholder="Buscar cidade"
          value={search}
          onChangeText={setSearch}
          style={globalStyles.searchInput}
          placeholderTextColor={theme.colors.textLight}
        />

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 16 }} />
        ) : (
          <FlatList
            data={search.length < 3 ? fullCityList : results}
            keyExtractor={(item, index) =>
              `${item.name}-${item.state ?? ''}-${item.country ?? ''}-${index}`
            }
            renderItem={({ item }) => {
              const isFromSearch = search.length >= 3;
              const label =
                item.name === 'Localização atual'
                  ? item.name
                  : isFromSearch
                  ? `${getPreferredCityName(item)}, ${item.state ?? ''}, ${item.country ?? ''}`
                  : formatLocationName(getPreferredCityName(item), item.state, item.country);

              return (
                <TouchableOpacity
                  style={globalStyles.cityItem}
                  onPress={() => handleSelectCity(item)}
                >
                  <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
                  <Text style={globalStyles.cityName}>{label}</Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};
