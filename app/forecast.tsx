
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
import HourlyForecastCard from '../components/HourlyForecastCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from 'i18next';

export default function ForecastScreen() {
  const router = useRouter();
  const [city, setCity] = useState<string>('Carregando...');
  const [weather, setWeather] = useState<any>(null);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const { t } = useTranslation();
  const [hasError, setHasError] = useState(false);

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
      try {
        const clima = await getWeatherByCity(raw);
        const horas = await getHourlyForecastByCity(raw);

        setWeather(clima);
        setHourlyData(horas);
      } catch (e) {
        console.error('Erro ao buscar clima ou previsão horária:', e);
        // opcional: setar estado para fallback visual
        setHasError(true);
        setWeather(null);
        setHourlyData([]);
      }

    };

    load();
  }, []);

  const frase =
    weather &&
    getFraseClimatica(t,{
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

  if (hasError) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Text style={[globalStyles.errorText, { textAlign: 'center', marginBottom: 16 }]}>
          {t('Forecast.errorMessage')}
        </Text>

        <TouchableOpacity
          onPress={() => router.replace('/forecast')}
          style={globalStyles.bottomButton}
        >
          <Ionicons name="refresh" size={16} color={theme.colors.textDark} />
          <Text style={globalStyles.bottomButtonText}>{t('Forecast.retryButton')}</Text>

        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {weather && (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ backgroundColor: theme.colors.background }}>
            <ForecastHeader
              city={city}
              date={new Date().toLocaleDateString(i18n.language, {
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
              id={weather?.id ?? 0}
            />

            <View style={globalStyles.container}>
              <Text style={globalStyles.firstSectionTitle}>{t('Forecast.sectionTitle')}</Text>
              <View style={globalStyles.sectionDivider} />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: theme.spacing.md, gap: 8 }}
              >
                {hourlyData.map((item, i) => (
                  <HourlyForecastCard
                    key={i}
                    time={item.hora}
                    icon={item.icon}
                    temperature={item.temperatura}
                  />
                ))}
              </ScrollView>

              <Text style={globalStyles.sectionTitle}>{t('Forecast.sectionTitleDetais')}</Text>
              <View style={globalStyles.sectionDivider} />

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
          </ScrollView>

          {/* ✅ Botão agora dentro da SafeArea */}
          <TouchableOpacity
            style={globalStyles.bottomButton}
            onPress={() => router.push('/home')}
          >
            <Ionicons name="arrow-back" size={16} color={theme.colors.textDark} />
            <Text style={globalStyles.bottomButtonText}>{t('Forecast.backButton')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
