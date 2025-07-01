// components/ForecastHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';

type Props = {
  city: string;
  date: string;
  backgroundColor: string;
  temperature: string;
  condition: string;
  smartPhrase: string;
  icon?: React.ReactNode;
};

export default function ForecastHeader({
  city,
  date,
  backgroundColor,
  temperature,
  condition,
  smartPhrase,
  icon,
}: Props) {
  return (
    <View style={[globalStyles.forecastHeader, { backgroundColor }]}>
      <View style={globalStyles.forecastHeaderLocation}>
        <Ionicons name="location-outline" size={16} color={theme.colors.textDark} />
        <Text style={globalStyles.forecastHeaderCity}>{city}</Text>
      </View>

      <Text style={globalStyles.forecastHeaderDate}>{date}</Text>

      {icon && <View style={globalStyles.forecastHeaderIcon}>{icon}</View>}

      <Text style={globalStyles.forecastHeaderTemperature}>{temperature}</Text>
      <Text style={globalStyles.forecastHeaderCondition}>{condition}</Text>
      <Text style={globalStyles.forecastHeaderSmartPhrase}>{smartPhrase}</Text>
    </View>
  );
}
