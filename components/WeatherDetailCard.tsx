import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/global';

interface WeatherDetailCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

export default function WeatherDetailCard({
  icon,
  title,
  value,
}: WeatherDetailCardProps) {
  return (
    <View style={globalStyles.detailCard}>
      {icon}
      <Text style={globalStyles.detailTitle}>{title}</Text>
      <Text style={globalStyles.detailValue}>{value}</Text>
    </View>
  );
}