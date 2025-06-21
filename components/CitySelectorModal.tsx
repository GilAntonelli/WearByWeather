import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import { KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
];

interface CitySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
}

export const CitySelectorModal = ({
  visible,
  onClose,
  onSelect,
}: CitySelectorModalProps) => {
  const [search, setSearch] = useState('');

  const filteredCities = cityList.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
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
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={globalStyles.cityItem}
              onPress={async () => {
                await AsyncStorage.setItem('lastCity', item);
                onSelect(item);
                onClose();
              }}
            >
              <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.cityName}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};