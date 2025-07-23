import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { capitalizeFirstLetter } from '../utils/stringUtils';
import { getWeatherGradientColors } from '../utils/weatherColors';
import { useTranslation } from 'react-i18next';

type Props = {
  city: string;
  temperature: string;
  condition: string;
  smartPhrase: string;
  icon?: React.ReactNode;
  id: number;
  localTime?: string;
};

export default function ForecastHeader({
  city,

  temperature,
  condition,
  smartPhrase,
  icon,
  id, localTime,
}: Props) {
  const gradientColors = getWeatherGradientColors(id);
  const { t } = useTranslation();
  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      {/* <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="#FFF" />
        <Text style={styles.city}>{city}</Text>
      </View> */}

      {/* <Text style={styles.date}>{localDateFormatted}</Text> */}
      {/* {localTime && (
  <Text style={styles.localTime}>
    {t('localTimeLabel')}: {localTime}
  </Text>
)} */}

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="#FFF" />
        <Text style={styles.city}>
          {city}{localTime ? ` • ${localTime}` : ''}
        </Text>
      </View>

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
  localTime: {
    fontSize: 13,
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
