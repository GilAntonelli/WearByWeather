import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import WeatherSummaryCard from '../components/WeatherSummaryCard';
import { TopHeader } from '../components/TopHeader';
import { spacing } from '../styles/global';
import { LookSuggestionCard } from '../components/LookSuggestionCard';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { CitySelectorModal } from '../components/CitySelectorModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { getdetectedCity } from '../services/LocationService';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import { UserPreferences } from '../types/preferences';
import { LookSuggestion } from '../types/suggestion';
import { useTranslation } from 'react-i18next';
import FloatingMenu from '../components/FloatingMenu';

import {
  prefetchHomeData,
  getCachedHomeData,
  HomePrefetchData,
} from '../services/homePrefetch';

const resetApp = async () => {
  await AsyncStorage.clear();
  router.replace('/'); // back to WelcomeScreen
};

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const isLoadingRef = useRef<boolean>(false);
  const router = useRouter();
  const [city, setSelectedCity] = useState<string>('Lisboa');
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestion, setSuggestion] = useState<LookSuggestion | null>(null);
  const [weatherData, setWeatherData] = useState<{
    temperatura: number;
    sensacaoTermica: number;
    condicao?: string;
    chuva?: boolean;
    vento?: number;
    icon?: string;
    tempMin?: number;
    tempMax?: number;
    id?: number;
  } | null>(null);

  const [isCityReady, setIsCityReady] = useState(false);
  const [isDetectedLocation, setIsDetectedLocation] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    name: '',
    gender: 'masculino',
    comfort: 'neutro',
  });
  const { t } = useTranslation();

  const detectCityFromLocation = async (): Promise<boolean> => {
    const savedCity = await AsyncStorage.getItem('lastCity');
    if (savedCity) {
      try {
        const parsed = JSON.parse(savedCity);
        const label = parsed.label || parsed;
        setSelectedCity(label);
      } catch {
        setSelectedCity(savedCity);
      }
    }
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const saved = await AsyncStorage.getItem('lastCity');

      if (saved) {
        setSelectedCity(saved);
        return true;
      }

      if (status !== 'granted') {
        console.log('Location permission denied');
        return false;
      }

      const detectedCity = await getdetectedCity();
      if (detectedCity) {
        setIsDetectedLocation(true);
        setSelectedCity(detectedCity);
        await AsyncStorage.setItem('lastCity', detectedCity);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error detecting city:', error);
      return false;
    }
  };

  const handleLocationPermissionRetry = async () => {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

    if (status === 'granted') return true;

    if (canAskAgain) {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      return newStatus === 'granted';
    }

    Alert.alert(
      t('alerts.typePermission'),
      t('alerts.detectCityAlert'),
      [
        { text: t('alerts.cancelbutton'), style: 'cancel' },
        { text: t('alerts.text'), onPress: () => Linking.openSettings() },
      ]
    );

    return false;
  };
  

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const json = await AsyncStorage.getItem('@user_preferences');
        if (json) {
          const prefs = JSON.parse(json);
          if (
            ['male', 'female', 'unisex'].includes(prefs.gender) &&
            ['feel_cold', 'feel_hot', 'neutral'].includes(prefs.comfort)
          ) {
            setUserPreferences({
              name: prefs.name || '',
              gender: prefs.gender,
              comfort: prefs.comfort,
            });
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  useEffect(() => {
    const cached = getCachedHomeData();
    if (cached && !suggestion) {
      applyPrefetchResult(cached);
    }
  }, []);

  const applyPrefetchResult = (data: HomePrefetchData) => {
    setWeatherData({
      temperatura: data.weather.temperatura,
      sensacaoTermica: data.weather.sensacaoTermica,
      condicao: data.weather.condicao,
      tempMin: data.weather.tempMin,
      tempMax: data.weather.tempMax,
      chuva: data.weather.chuva,
      vento: data.weather.vento,
      icon: data.weather.icon,
      id: data.weather.id,
    });
    setSuggestion(data.suggestion);
  };

  const runPrefetch = useCallback(
    async (rawOrLabelCity: string) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      try {
        const result = await prefetchHomeData(
          rawOrLabelCity,
          { gender: userPreferences.gender, comfort: userPreferences.comfort },
          t
        );
        
        applyPrefetchResult(result);
        
        try {
          const savedCity = await AsyncStorage.getItem('lastCity');
          let label = rawOrLabelCity;
          if (savedCity) {
            try {
              const parsed = JSON.parse(savedCity);
              label = parsed.label || parsed.raw || savedCity;
            } catch {
              label = savedCity;
            }
          }
          setSelectedCity(label);
        } catch { /* noop */ }
      } catch (e) {
        console.error('Error prefetching home data:', e);
      } finally {
        isLoadingRef.current = false;
      }
    },
    [t, userPreferences]
  );


  useEffect(() => {
    const init = async () => {
      const granted = await detectCityFromLocation();
      if (!granted) {
        setModalVisible(true);
      } else {
        setIsCityReady(true);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (isCityReady && city && userPreferences.gender && userPreferences.comfort) {
      runPrefetch(city);
    }
  }, [isCityReady, city, userPreferences, runPrefetch]);

  const reloadWeather = useCallback(async () => {
    await runPrefetch(city);
  }, [runPrefetch, city]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{
          ...globalStyles.container,
          minHeight: screenHeight + 120,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!isCityReady ? (
          <>
            <Text style={globalStyles.loadingText}>
              {modalVisible ? t('home.selectCity') : t('home.detectingLocation')}
            </Text>
            <PrimaryButton
              title={t('home.trydetectingLocation')}
              onPress={async () => {
                const granted = await handleLocationPermissionRetry();
                if (granted) {
                  const ok = await detectCityFromLocation();
                  if (ok) setIsCityReady(true);
                }
              }}
              style={{ marginTop: 16 }}
            />
          </>
        ) : (
          <>
            <TopHeader
              title={
                userPreferences.name
                  ? `${t('home.greeting')}, ${userPreferences.name}!`
                  : `${t('home.greeting')}!`
              }
              renderAnchor={() => <FloatingMenu reloadWeather={reloadWeather} />}
            />

            <TouchableOpacity
              style={globalStyles.fakeSearchInput}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="search" size={18} color="#999" style={{ marginRight: 8 }} />
              <Text style={globalStyles.fakeSearchText}>{t('cityModal.searchPlaceholder')}</Text>
            </TouchableOpacity>

            {weatherData && (
              <WeatherSummaryCard
                city={city}
                isUsingLocation={isDetectedLocation}
                temperatura={weatherData.temperatura}
                sensacaoTermica={weatherData.sensacaoTermica}
                tempMin={weatherData.tempMin ?? 0}
                tempMax={weatherData.tempMax ?? 0}
                condicao={weatherData.condicao || ''}
                id={weatherData.id || 0}
                onPress={() => router.push('/forecast')}
              />
            )}

            <Text
              style={[
                globalStyles.firstSectionTitle,
                { marginTop: spacing.section },
              ]}
            >
              {t('home.suggestionTitle')}
            </Text>

            {suggestion ? (
              <LookSuggestionCard suggestion={suggestion} />
            ) : (
              <View
                style={{
                  height: 220,
                  borderRadius: 16,
                  backgroundColor: '#eee',
                }}
              />
            )}
          </>
        )}

        <CitySelectorModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={async (newCity) => {
            setIsDetectedLocation(false);
            setSelectedCity(newCity);
            await AsyncStorage.setItem(
              'lastCity',
              JSON.stringify({ raw: newCity, label: newCity })
            );

            try {
              const json = await AsyncStorage.getItem('@user_preferences');
              const prefs = json
                ? JSON.parse(json)
                : { gender: 'male', comfort: 'neutral' };
              const result = await prefetchHomeData(
                newCity,
                { gender: prefs.gender, comfort: prefs.comfort },
                t
              );
              applyPrefetchResult(result);
            } catch (e) {
              console.warn('Prefetch on city change failed:', e);
            }

            setModalVisible(false);
            setIsCityReady(true);
          }}
        />
      </ScrollView>

      {isCityReady && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: theme.colors.background,
          }}
        >
          <PrimaryButton
            title={t('home.forecastButton')}
            onPress={() => router.push('/forecast')}
          />
        </View>
      )}
    </SafeAreaView>
  );
}