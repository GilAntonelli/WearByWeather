// components/ForecastHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';

type Props = {
  city: string;
  date: string;
};

export default function ForecastHeader({ city, date }: Props) {
  return (
    <View style={globalStyles.forecastHeader}>
      <View style={globalStyles.forecastHeaderLocation}>
        <Ionicons name="location-outline" size={16} color={theme.colors.textDark} />
        <Text style={globalStyles.forecastHeaderCity}>{city} - Hoje</Text>
      </View>
      <Text style={globalStyles.forecastHeaderDate}>{date}</Text>
    </View>
  );
}
