
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ForecastHeader from '../components/ForecastHeader';
import { getFraseClimatica } from '../services/weatherPhrases';
import {
  getHourlyForecastByCity,
  getWeatherByCity,
} from '../services/weatherService';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import WeatherDetailCard from '../components/WeatherDetailCard';

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
  const { t } = useTranslation();

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem('lastCity');
      let raw = 'Lisboa';
      let label = 'Lisboa';
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          raw = parsed.raw || parsed;
          label = parsed.label || parsed;
        } catch {
          raw = saved;
          label = saved;
        }
      }
      setCity(label);
      const clima = await getWeatherByCity(raw);
      const horas = await getHourlyForecastByCity(raw);

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


  function formatCompactLabel(name: string, state?: string, country?: string): string {
    const parts = [name];
    if (state) parts.push(state.toUpperCase());
    if (country) parts.push(country.toUpperCase());
    return parts.join(', ');
  }

  return (
    <>
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={{ paddingTop: 24 }}>
          <ForecastHeader
            city={city}
            date={new Date().toLocaleDateString('pt-PT', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
            })}
            temperature={`${weather?.temperatura ?? '--'}°C`}
            condition={weather?.condicao ?? t('Forecast.condition')}
            smartPhrase={frase ?? ''}
            icon={
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${weather?.icon ?? '01d'}@2x.png`,
                }}
                style={{ width: 64, height: 64 }}
              />
            }
          />
        </View>
        <View style={globalStyles.container}>
          <Text style={globalStyles.sectionTitle}>{t('Forecast.sectionTitle')}</Text>
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
                <Text style={globalStyles.hourTemp}>{typeof item.temperatura === 'number' ? `${item.temperatura}°C` : `${item.temperatura}`.replace('°C', '') + '°C'}</Text>
              </View>
            ))}
          </ScrollView>

          <Text style={globalStyles.sectionTitle}>{t('Forecast.sectionTitleDetais')}</Text>

          <View style={globalStyles.detailGrid}>
            <WeatherDetailCard
              icon={<Ionicons name="thermometer-outline" size={20} color={theme.colors.primary} />}
              title={t('Forecast.detailTitle')}
              value={`${t('Forecast.temperatureMax')}: ${weather?.tempMax ?? '--'}°C ${t('Forecast.temperatureMin')}: ${weather?.tempMin ?? '--'}°C`}
            />
            <WeatherDetailCard
              icon={<Ionicons name="rainy-outline" size={20} color={theme.colors.primary} />}
              title={t('Forecast.rainDetail')}
              value={`${weather?.chuva ? t('Forecast.possibleRain') : t('Forecast.withoutRain')} (estimativa)`}
            />
            <WeatherDetailCard
              icon={<Feather name="wind" size={20} color={theme.colors.primary} />}
              title={t('Forecast.windDetail')}
              value={`${weather?.vento ?? '--'} km/h`}
            />
            <WeatherDetailCard
              icon={<Ionicons name="water-outline" size={20} color={theme.colors.primary} />}
              title={t('Forecast.humidityDetail')}
              value={`${weather?.umidade ?? '--'}% ${t('Forecast.humidityAir')}`}
            />
            <WeatherDetailCard
              icon={<Ionicons name="thermometer" size={20} color={theme.colors.primary} />}
              title={t('Forecast.ThermalSenation')}
              value={`${weather?.sensacaoTermica ?? '--'}°C`}
            />
          </View>





        </View>
      </ScrollView >

      <TouchableOpacity
        style={globalStyles.bottomButton}
        onPress={() => router.push('/home')}
      >
        <Ionicons name="arrow-back" size={16} color={theme.colors.textDark} />
        <Text style={globalStyles.bottomButtonText}>{t('Forecast.backButton')}</Text>
      </TouchableOpacity>
    </>
  );
}
