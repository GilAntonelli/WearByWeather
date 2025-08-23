// components/WeatherSummaryCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
 
import { getWeatherGradientColors, getWeatherGradientColorsByIcon } from '../utils/weatherColors';

import { capitalizeFirstLetter } from '../utils/stringUtils';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface WeatherSummaryCardProps {
  city: string;
  isUsingLocation: boolean;
  temperatura: number;
  sensacaoTermica: number;
  condicao: string;
  tempMin: number;
  tempMax: number;
  id: number;
  icon: string;
  onPress?: () => void;
}

export default function WeatherSummaryCard({
  city,
  isUsingLocation,
  temperatura,
  sensacaoTermica,
  condicao,
  tempMin,
  tempMax,
  id,
  icon,
  onPress
}: WeatherSummaryCardProps) {
  const { t } = useTranslation();
 const gradientColors = icon
  ? getWeatherGradientColorsByIcon(id, icon)
  : getWeatherGradientColors(id);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.92]}   // push overlay to the bottom (12% of card)
        style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.cityText}>{city}</Text>

            <Text style={styles.condicaoText}>
              {capitalizeFirstLetter(condicao)}
            </Text>
            <Text style={styles.minMaxText}>
              {t('WeatherSummaryCard.maxMin', { max: Math.round(tempMax), min: Math.round(tempMin) })}
            </Text>

            <Text style={styles.feelsLikeText}>
              {t('WeatherSummaryCard.feelsLike', { value: Math.round(sensacaoTermica) })}
            </Text>
          </View>
          <Text style={styles.tempText}>{Math.round(temperatura)}°</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  cityText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFF',
  },
  locationLabel: {
    fontSize: 12,
    color: '#FFF',
  },
  condicaoText: {
    marginTop: 6,
    fontSize: 14,
    color: '#FFF',
  },
  minMaxText: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 4,
  },
  tempText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  feelsLikeText: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 4,
    opacity: 0.95,
  },
});
