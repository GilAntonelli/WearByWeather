// components/HourlyForecastCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  time: string;
  icon?: string;
  temperature: string | number;
  rainMM?: number;
  willRain?: boolean;
  popPct?: number;
  testID?: string;
}

const HourlyForecastCard = ({ time, icon, temperature, rainMM, willRain, popPct, testID }: Props) => {

  const displayTemp =
    Number.isFinite(Number(temperature))
      ? `${Math.round(Number(temperature))}°C`
      : String(temperature).replace(/°C$/i, '') + '°C';

  const showRain = typeof popPct === 'number'
    || (typeof rainMM === 'number' && rainMM > 0)
    || willRain === true;

  const rainLabel =
    typeof popPct === 'number'
      ? `${Math.round(popPct)}%`
      : (typeof rainMM === 'number'
        ? `${rainMM >= 1 ? rainMM.toFixed(0) : rainMM.toFixed(1)} mm`
        : (willRain ? '—' : undefined));

  return (
    <View
      style={globalStyles.hourCard}
      testID={testID ?? 'hourly-card'}
      accessibilityLabel={`Hourly forecast ${time}`}
    >
      <Text style={globalStyles.hourLabel}>{time}</Text>
      {icon ? (
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
          style={styles.icon}
          accessibilityLabel={`Weather at ${time}`}
          accessibilityRole="image"
        />
      ) : (
        <Ionicons
          name="cloud-outline"
          size={28}
          color={theme.colors.textMuted ?? '#777'}
          accessibilityLabel="Weather icon unavailable"
          accessibilityRole="image"
          style={{ marginVertical: 6 }}
        />
      )}
      <Text style={globalStyles.hourTemp}>{displayTemp}</Text>
      {showRain && rainLabel !== undefined && (
        <View style={styles.rainRow} testID="precip-row" accessibilityLabel="Precipitation">
          <Ionicons
            name={willRain ? 'rainy' : 'rainy-outline'}
            size={12}
            color={theme.colors.primary}
            style={{ marginRight: 4 }}
            accessibilityLabel={willRain ? 'Rain expected' : 'No significant rain'}
            accessibilityRole="image"
          />
          <Text style={styles.rainText}>{rainLabel}</Text>
        </View>
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
  },
  rainRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rainText: {
    fontSize: 11,
    color: theme.colors.textMuted ?? '#777',

  },
});

export default React.memo(HourlyForecastCard);

