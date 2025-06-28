
import { Menu, Divider } from 'react-native-paper';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import { getFraseClimatica } from '../services/weatherPhrases';
import {
  getWeatherByCity,
  getHourlyForecastByCity,
  // Futuro: getCoordinatesByCity,
  // Futuro: getHourlyOneCallForecast,
} from '../services/weatherService';

export default function ForecastScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const resetApp = async () => {
    await AsyncStorage.clear();
    router.replace('/');
  };

  const [city, setCity] = useState<string>('Carregando...');
  const [weather, setWeather] = useState<any>(null);
  const [hourlyData, setHourlyData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const savedCity = await AsyncStorage.getItem('lastCity');
      const selectedCity = savedCity || 'Lisboa';
      setCity(selectedCity);

      const clima = await getWeatherByCity(selectedCity);
      const horas = await getHourlyForecastByCity(selectedCity);

      setWeather(clima);
      setHourlyData(horas);
    };

    load();
  }, []);

  const frase =
    weather &&
    getFraseClimatica({
      temperatura: weather.temperatura,
      condicao: weather.condicao,
      chuva: weather.chuva,
      vento: weather.vento,
    });

  return (
    <>
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        {/* Cabeçalho com clima atual */}

        <View style={globalStyles.forecastHeader}>
          {/* Ícone de engrenagem com menu flutuante */}
    <View style={{ position: 'absolute', top: 48, right: 16, zIndex: 10 }}>

      <Menu
  visible={menuVisible}
  onDismiss={() => setMenuVisible(false)}
  anchor={
    <TouchableOpacity onPress={() => setMenuVisible(true)}>
      <Ionicons name="settings-outline" size={24} color={theme.colors.textDark} />
    </TouchableOpacity>
  }
>
  <Menu.Item
    onPress={() => {
      setMenuVisible(false);
      router.push('/preferences');
    }}
    title="Preferências"
    leadingIcon="tune"
  />
  <Divider />
  <Menu.Item
    onPress={() => {
      setMenuVisible(false);
      router.push('/');
    }}
    title="Início"
    leadingIcon="home-outline"
  />
  <Divider />
  <Menu.Item
    onPress={() => {
      setMenuVisible(false);
      Alert.alert(
        'Redefinir app',
        'Tem certeza que deseja apagar suas preferências e reiniciar o app?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Redefinir',
            style: 'destructive',
            onPress: async () => {
              await AsyncStorage.clear();
              router.replace('/');
            },
          },
        ]
      );
    }}
    title="Redefinir app"
    leadingIcon="restart"
  />
</Menu>
  
          </View>

          <Ionicons name="location-outline" size={16} color={theme.colors.textDark} />
          <Text style={globalStyles.forecastHeaderCity}>
            {city} - Hoje
          </Text>
          <Text style={globalStyles.forecastHeaderDate}>
            {new Date().toLocaleDateString('pt-PT', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
            })}
          </Text>
          <Feather name="sun" size={48} color="#FFC300" style={{ marginVertical: 8 }} />
          <Text style={globalStyles.forecastMainTemp}>
            {weather?.temperatura ?? '--'}°C
          </Text>
          <Text style={globalStyles.forecastWeatherLabel}>
            {weather?.condicao ?? 'Carregando...'}
          </Text>
          {frase && (
            <Text style={globalStyles.weatherInfo}>"{frase}"</Text>
          )}
        </View>




        <View style={globalStyles.container}>
          {/* Previsão por hora */}
          <Text style={globalStyles.sectionTitle}>Próximas 24h (intervalos de 3h)</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
          >
            {hourlyData.map((item, i) => (
              <View key={i} style={globalStyles.hourCard}>
                <Text style={globalStyles.hourLabel}>{item.hora}</Text>
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png`,
                  }}
                  style={{ width: 40, height: 40 }}
                />
                <Text style={globalStyles.hourTemp}>{item.temperatura}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Detalhes climáticos */}
          <Text style={globalStyles.sectionTitle}>Detalhes Climáticos</Text>
          <View style={globalStyles.detailGrid}>
            <View style={globalStyles.detailCard}>
              <Ionicons name="thermometer-outline" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Temperatura</Text>
              <Text style={globalStyles.detailValue}>
                Máx: {weather?.tempMax ?? '--'}°C{'\n'}Min: {weather?.tempMin ?? '--'}°C
              </Text>
            </View>

            <View style={globalStyles.detailCard}>
              <Ionicons name="rainy-outline" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Chuva</Text>
              <Text style={globalStyles.detailValue}>
                {weather?.chuva ? 'Possível chuva' : 'Sem chuva'}{'\n'}(estimativa)
              </Text>
            </View>

            <View style={globalStyles.detailCard}>
              <Feather name="wind" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Vento</Text>
              <Text style={globalStyles.detailValue}>
                {weather?.vento ?? '--'} km/h
              </Text>
            </View>

            <View style={globalStyles.detailCard}>
              <Ionicons name="water-outline" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Umidade</Text>
              <Text style={globalStyles.detailValue}>
                {weather?.umidade ?? '--'}%{'\n'}Umidade relativa do ar
              </Text>
            </View>

            <View style={globalStyles.detailCardFull}>
              <Ionicons name="thermometer" size={20} color={theme.colors.primary} />
              <Text style={globalStyles.detailTitle}>Sensação Térmica</Text>
              <Text style={globalStyles.detailValue}>
                {weather?.sensacaoTermica ?? '--'}°C
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão fixo */}
      <TouchableOpacity
        style={globalStyles.bottomButton}
        onPress={() => router.push('/home')}
      >
        <Ionicons name="arrow-back" size={16} color={theme.colors.textDark} />
        <Text style={globalStyles.bottomButtonText}>Voltar para o look do dia</Text>
      </TouchableOpacity>
    </>
  );
}
