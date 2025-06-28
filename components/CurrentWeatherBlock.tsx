// components/CurrentWeatherBlock.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';

type Props = {
  temperatura: string;
  condicao: string;
  frase: string | null;
};

export default function CurrentWeatherBlock({ temperatura, condicao, frase }: Props) {
  return (
    <View style={globalStyles.currentWeatherBlock}>
      <Feather name="sun" size={48} color="#FFC300" style={{ marginVertical: 8 }} />
      <Text style={globalStyles.forecastMainTemp}>{temperatura ?? '--'}°C</Text>
      <Text style={globalStyles.forecastWeatherLabel}>{condicao ?? 'Carregando...'}</Text>
      {frase && <Text style={globalStyles.weatherInfo}>"{frase}"</Text>}
    </View>
  );
}
