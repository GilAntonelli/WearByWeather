import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';

export default function ForecastScreen() {
  const router = useRouter();

  return (
    <>
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        {/* Cabeçalho com clima atual */}
        <View style={globalStyles.forecastHeader}>
          <Ionicons name="location-outline" size={16} color={theme.colors.textDark} />
          <Text style={globalStyles.forecastHeaderCity}>São Paulo - Hoje</Text>
          <Text style={globalStyles.forecastHeaderDate}>Segunda-feira, 10 de Junho</Text>
          <Feather name="sun" size={48} color="#FFC300" style={{ marginVertical: 8 }} />
          <Text style={globalStyles.forecastMainTemp}>24°C</Text>
          <Text style={globalStyles.forecastWeatherLabel}>Ensolarado</Text>
        </View>

        <View style={globalStyles.container}>
          {/* Previsão por hora */}
          <Text style={globalStyles.sectionTitle}>Previsão por Hora</Text>
          <View style={globalStyles.hourlyRow}>
            {[
              { hour: '08h', temp: '21°C', icon: 'sunny' },
              { hour: '11h', temp: '24°C', icon: 'cloud-outline' },
              { hour: '14h', temp: '26°C', icon: 'partly-sunny-outline' },
              { hour: '17h', temp: '22°C', icon: 'rainy-outline' },
              { hour: '20h', temp: '22°C', icon: 'rainy-outline' },
              { hour: '23h', temp: '22°C', icon: 'rainy-outline' },              
            ].map((item, i) => (
              <View key={i} style={globalStyles.hourCard}>
                <Text style={globalStyles.hourLabel}>{item.hour}</Text>
                <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} />
                <Text style={globalStyles.hourTemp}>{item.temp}</Text>
              </View>
            ))}
          </View>

          {/* Detalhes climáticos */}
          <Text style={globalStyles.sectionTitle}>Detalhes Climáticos</Text>
          <View style={globalStyles.detailGrid}>
            <View style={globalStyles.detailCard}>
              <Ionicons name="thermometer-outline" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Temperatura</Text>
              <Text style={globalStyles.detailValue}>Máx: 27°C{'\n'}Min: 18°C</Text>
            </View>

            <View style={globalStyles.detailCard}>
              <Ionicons name="rainy-outline" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Chuva</Text>
              <Text style={globalStyles.detailValue}>60%{'\n'}Possibilidade de pancadas</Text>
            </View>

            <View style={globalStyles.detailCard}>
              <Feather name="wind" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Vento</Text>
              <Text style={globalStyles.detailValue}>12 km/h{'\n'}Direção: Nordeste</Text>
            </View>

            <View style={globalStyles.detailCard}>
              <Ionicons name="water-outline" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Umidade</Text>
              <Text style={globalStyles.detailValue}>82%{'\n'}Umidade relativa do ar</Text>
            </View>

            <View style={globalStyles.detailCardFull}>
              <Ionicons name="thermometer" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Sensação Térmica</Text>
              <Text style={globalStyles.detailValue}>25°C</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão fixo */}
      <TouchableOpacity style={globalStyles.bottomButton} onPress={() => router.push('/home')}>
        <Ionicons name="arrow-back" size={16} color={theme.colors.textDark} />
        <Text style={globalStyles.bottomButtonText}>Voltar para o look do dia</Text>
      </TouchableOpacity>
    </>
  );
}