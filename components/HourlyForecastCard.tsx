// components/HourlyForecastCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    time: string;
    icon: string;
    temperature: string | number;
    rainMM?: number;     // NEW
    willRain?: boolean;  // NEW
    popPct?: number;     // OPTIONAL (if you later map POP in the service)
}

const HourlyForecastCard = ({ time, icon, temperature, rainMM, willRain, popPct }: Props) => {

    const displayTemp = typeof temperature === 'number'
        ? `${temperature}°C`
        : `${temperature}`.replace('°C', '') + '°C';

    const showRain = typeof popPct === 'number'
        || (typeof rainMM === 'number' && rainMM > 0)
        || willRain === true;

    const rainLabel =
        typeof popPct === 'number'
            ? `${popPct}%`
            : (typeof rainMM === 'number' ? `${rainMM.toFixed(1)} mm` : '');

    return (
        <View style={globalStyles.hourCard}>
            <Text style={globalStyles.hourLabel}>{time}</Text>
            <Image
                source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
                style={styles.icon}
            />
            <Text style={globalStyles.hourTemp}>{displayTemp}</Text>
            {showRain && (
                <View style={styles.rainRow}>
                    <Ionicons
                        name={willRain ? 'rainy' : 'rainy-outline'}
                        size={12}
                        color={theme.colors.primary}
                        style={{ marginRight: 4 }}
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

export default HourlyForecastCard;
