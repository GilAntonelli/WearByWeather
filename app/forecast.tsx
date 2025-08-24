// app/forecast.tsx
import { resolveInitialCity } from '../services/cityStorage';
 import  {CitySelectorModal}  from '../components/CitySelectorModal';

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
import { BackButton } from '../components/ui/BackButton';

import { prefetchHomeData } from '../services/homePrefetch';

export default function ForecastScreen() {
  const router = useRouter();
  const [city, setCity] = useState<string>('Carregando...');
  const [weather, setWeather] = useState<any>(null);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const { t } = useTranslation();
  const [hasError, setHasError] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const prefetchForHome = React.useCallback(async () => {
    try {
      const prefsRaw = await AsyncStorage.getItem('@user_preferences');
      const prefs = prefsRaw ? JSON.parse(prefsRaw) : { gender: 'male', comfort: 'neutral' };

      const { raw } = await resolveInitialCity({
        preferDetection: true,
        fallback: { raw: 'Lisbon', label: 'Lisboa' },
      });

      await prefetchHomeData(raw, { gender: prefs.gender, comfort: prefs.comfort }, t);
    } catch (e) {
      console.warn('prefetchForHome failed:', e);
    }
  }, [t]);

  useEffect(() => {
    const load = async () => {
      const { raw, label, source } = await resolveInitialCity({
        preferDetection: true,
        fallback: { raw: 'Lisbon', label: 'Lisboa' },
      });
      setCity(label);

      if (source === 'fallback') {
        setCityModalVisible(true);
        return; 
      }


      try {
        const clima = await getWeatherByCity(raw);
        const horas = await getHourlyForecastByCity(raw);

        setWeather(clima);
        setHourlyData(horas);

        await prefetchForHome();
      } catch (e) {
        console.error('Erro ao buscar clima ou previsão horária:', e);
        setHasError(true);
        setWeather(null);
        setHourlyData([]);
      }
    };

    load();
  }, [prefetchForHome]);

  const frase =
    weather &&
    getFraseClimatica(t, {
      temperatura: weather.temperatura,
      condicao: weather.condicao,
      descricao: weather.descricao,   

      chuva: weather.chuva,
      vento: weather.vento,
      umidade: weather.umidade,       
    });

  function formatCompactLabel(name: string, state?: string, country?: string): string {
    const parts = [name];
    if (state) parts.push(state.toUpperCase());
    if (country) parts.push(country.toUpperCase());
    return parts.join(', ');
  }

  if (hasError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <BackButton />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text
            style={[globalStyles.errorText, { textAlign: 'center', marginBottom: 16 }]}
          >
            {t('Forecast.errorMessage')}
          </Text>
        </View>


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

const handleCitySelected = async (label: string) => {
  // O modal já salvou { raw, label } em AsyncStorage antes de chamar onSelect(label)
  setHasError(false);
  setCity(label);
  setCityModalVisible(false);

  try {
    // re-lê o 'raw' salvo pelo modal
    const { raw } = await resolveInitialCity({
      preferDetection: false, // já temos a cidade escolhida
      fallback: { raw: 'Lisbon', label: 'Lisboa' },
    });

    const clima = await getWeatherByCity(raw);
    const horas = await getHourlyForecastByCity(raw);
    setWeather(clima);
    setHourlyData(horas);
    await prefetchForHome();
  } catch (e) {
    console.error('Erro ao buscar clima ou previsão horária:', e);
    setHasError(true);
    setWeather(null);
    setHourlyData([]);
  }
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {weather && (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ backgroundColor: theme.colors.background }}>
            <ForecastHeader
              city={city}
              temperature={`${weather?.temperatura ?? '--'}°C`}
              condition={weather?.condicao ?? t('Forecast.condition')}
              smartPhrase={frase ?? ''}
              id={weather.id}
              iconCode={weather.icon}
              icon={
                <Image
                  source={{
                    uri: `https://openweathermap.org/img/wn/${weather?.icon ?? '01d'}@2x.png`,
                  }}
                  style={{ width: 64, height: 64 }}
                />
              }

              localTime={weather?.localTime}
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
                    rainMM={item?.rainMM}
                    willRain={item?.chuva === true}
                  // Optional: if later you add forecast POP in the service:
                  // popPct={typeof item?.popPct === 'number' ? item.popPct : undefined}
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
                  value={
                    `${weather?.chuva ? t('Forecast.possibleRain') : t('Forecast.withoutRain')}`
                    + (typeof weather?.rainMM === 'number' ? ` • ${weather.rainMM.toFixed(1)} mm` : '')
                  }
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

          <TouchableOpacity
            style={globalStyles.bottomButton}
            onPress={async () => {
              await prefetchForHome();
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={16} color={theme.colors.textDark} />
            <Text style={globalStyles.bottomButtonText}>{t('Forecast.backButton')}</Text>
          </TouchableOpacity>
        </View>

      )}
      <CitySelectorModal
        visible={cityModalVisible}          // se o seu modal usa "isVisible", troque o nome da prop aqui
        onClose={() => setCityModalVisible(false)}
        onSelect={handleCitySelected}       // callback que você já implementou acima
      />

    </SafeAreaView>
  );
}
