import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';

interface Props {
    time: string;
    icon: string;
    temperature: string | number;
}

const HourlyForecastCard = ({ time, icon, temperature }: Props) => {
    const displayTemp = typeof temperature === 'number' ? `${temperature}°C` : `${temperature}`.replace('°C', '') + '°C';

    return (
        <View style={globalStyles.hourCard}>
            <Text style={globalStyles.hourLabel}>{time}</Text>
            <Image
                source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
                style={styles.icon}
            />
            <Text style={globalStyles.hourTemp}>{displayTemp}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 40,
        height: 40,
    },
});

export default HourlyForecastCard;
