import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { capitalizeFirstLetter } from '../utils/stringUtils';
import { getWeatherGradientColors } from '../utils/weatherColors';

type Props = {
  city: string;
  date: string;
  temperature: string;
  condition: string;
  smartPhrase: string;
  icon?: React.ReactNode;
};

export default function ForecastHeader({
  city,
  date,
  temperature,
  condition,
  smartPhrase,
  icon,
}: Props) {
  const gradientColors = getWeatherGradientColors(condition);

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="#FFF" />
        <Text style={styles.city}>{city}</Text>
      </View>

      <Text style={styles.date}>{date}</Text>

      {icon && <View style={styles.iconWrapper}>{icon}</View>}

      <Text style={styles.temperature}>{temperature}</Text>

      <Text style={styles.condition}>{capitalizeFirstLetter(condition)}</Text>

      <Text style={styles.smartPhrase}>{smartPhrase}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',

  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  city: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  iconWrapper: {
    marginBottom: 4,
  alignItems: 'center',
  justifyContent: 'center',
  },
  temperature: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  condition: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 4,
  },
  smartPhrase: {
    fontSize: 13,
    color: '#FFF',
    marginTop: 4,
  },
});
