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
import { normalizeCityName } from '../utils/normalizeCity'; // ✅ Importado corretamente

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

  const cityList = [
    'Lisboa',
    'Porto',
    'Madrid',
    'Barcelona',
    'Paris',
    'Londres',
    'Berlim',
    'Roma',
    'Bruxelas',
    'Amsterdã',
    'São Paulo',
    'Rio de Janeiro',
  ];

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

  const handleSelectCity = async (cityName: string) => {
    setLoading(true);

    const nomeParaApi = normalizeCityName(cityName); // ✅ Uso correto da função centralizada

    const clima = await getWeatherByCity(nomeParaApi);
    setLoading(false);

    if (!clima) {
      Alert.alert('Cidade inválida', 'Não foi possível obter dados climáticos para esta cidade.');
      return;
    }

    await AsyncStorage.setItem('lastCity', cityName); // Salva o nome exibido original
    onSelect(cityName);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={globalStyles.overlay} onPress={onClose} />
      <KeyboardAvoidingView
        style={globalStyles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            data={search.length < 3 ? cityList.map((name) => ({ name })) : results}
            keyExtractor={(item, index) => {
              const city = item as Suggestion;
              return `${city.name}-${city.state ?? ''}-${city.country ?? ''}-${index}`;
            }}
            renderItem={({ item }) => {
              const city = item as Suggestion;
              const label = `${city.name}${city.state ? ', ' + city.state : ''}${
                city.country ? ', ' + city.country : ''
              }`;

              return (
                <TouchableOpacity
                  style={globalStyles.cityItem}
                  onPress={() => handleSelectCity(city.name)}
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
