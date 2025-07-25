
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import WeatherSummaryCard from '../components/WeatherSummaryCard';
import { getWeatherByCity } from '../services/weatherService';
import { TopHeader } from '../components/TopHeader'; // certifique-se de adicionar no topo
import { spacing } from '../styles/global';
import { LookSuggestionCard } from '../components/LookSuggestionCard';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, Menu } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { CitySelectorModal } from '../components/CitySelectorModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { accessoryImages } from '../constants/accessoryImages';
import { getdetectedCity } from '../services/LocationService';
import { getSuggestionByWeather } from '../services/suggestionEngine';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import { UserPreferences } from '../types/preferences';
import { LookSuggestion } from '../types/suggestion';
import { useTranslation } from 'react-i18next';
import FloatingMenu from '../components/FloatingMenu';

const resetApp = async () => {
  await AsyncStorage.clear();
  router.replace('/'); // volta para a WelcomeScreen
};

const screenHeight = Dimensions.get('window').height;


export default function HomeScreen() {
  const isLoadingRef = useRef<boolean>(false);
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
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
      const savedCity = await AsyncStorage.getItem('lastCity');

      if (savedCity) {
        setSelectedCity(savedCity);
        return true;
      }

      if (status !== 'granted') {
        console.log('Permissão de localização negada');
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
      console.error('Erro ao detectar cidade:', error);
      return false;
    }
  };

  const handleLocationPermissionRetry = async () => {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

    if (status === 'granted') {
      return true;
    }

    if (canAskAgain) {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus === 'granted') {
        return true;
      } else {
        return false;
      }
    }

    Alert.alert(
      t('alerts.typePermission'),
      t('alerts.detectCityAlert'),
      [
        { text: t('alerts.cancelbutton'), style: 'cancel' },
        {
          text: t('alerts.text'),
          onPress: () => Linking.openSettings(),
        },
      ]
    );

    return false;
  };

  const reloadWeather = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const savedCity = await AsyncStorage.getItem('lastCity');
      let raw = city;
      let label = city;
      if (savedCity) {
        try {
          const parsed = JSON.parse(savedCity);
          raw = parsed.raw || parsed;
          label = parsed.label || parsed;
        } catch {
          raw = savedCity;
          label = savedCity;
        }
      }
      setSelectedCity(label);

      const weather = await getWeatherByCity(raw);
      if (!weather) return;

      setWeatherData({
        temperatura: weather.temperatura,
        sensacaoTermica: weather.sensacaoTermica,
        condicao: weather.condicao,
        tempMin: weather.tempMin,
        tempMax: weather.tempMax,
        chuva: weather.chuva,
        vento: weather.vento,
        icon: weather.icon,
        id: weather.id,
      });

      const clima = {
        ...weather,
        genero: userPreferences.gender,
        conforto: userPreferences.comfort,
        t: t,
      };

      const result = getSuggestionByWeather(clima);
      console.log('Sugestão recarregada:', result);
      setSuggestion(result);
    } catch (e) {
      console.error('Erro ao recarregar sugestão:', e);
    } finally {
      isLoadingRef.current = false;
    }
  }, [city, userPreferences, t]);

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
        console.error('Erro ao carregar preferências:', error);
      }
    };

    loadPreferences();
  }, []);

  useEffect(() => {
    const loadSuggestion = async () => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      try {
        const savedCity = await AsyncStorage.getItem('lastCity');
        let raw = city;
        let label = city;
        if (savedCity) {
          try {
            const parsed = JSON.parse(savedCity);
            raw = parsed.raw || parsed;
            label = parsed.label || parsed;
          } catch {
            raw = savedCity;
            label = savedCity;
          }
        }
        setSelectedCity(label);

        const weather = await getWeatherByCity(raw);
        if (!weather) return;

        setWeatherData({
          temperatura: weather.temperatura,
          sensacaoTermica: weather.sensacaoTermica,
          condicao: weather.condicao,
          tempMin: weather.tempMin,
          tempMax: weather.tempMax,
          chuva: weather.chuva,
          vento: weather.vento,
          icon: weather.icon,
          id: weather.id,
        });

        const clima = {
          ...weather,
          genero: userPreferences.gender,
          conforto: userPreferences.comfort,
          t: t,
        };

        const result = getSuggestionByWeather(clima);
        console.log('Sugestão carregada:', result);
        setSuggestion(result);
      } catch (e) {
        console.error('Erro ao carregar sugestão:', e);
      } finally {
        isLoadingRef.current = false;
      }
    };

    if (isCityReady && city && userPreferences.gender && userPreferences.comfort) {
      loadSuggestion();
    }
  }, [isCityReady, city, userPreferences]);

  useEffect(() => {
    const loadCity = async () => {
      const granted = await detectCityFromLocation();
      if (!granted) setModalVisible(true);
      else setIsCityReady(true);
    };
    loadCity();
  }, []);

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
                  const sucesso = await detectCityFromLocation();
                  if (sucesso) setIsCityReady(true);
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
            <Text style={[globalStyles.firstSectionTitle, {
              marginTop: spacing.section
            }]}>
              {t('home.suggestionTitle')}
            </Text>

            {suggestion && <LookSuggestionCard suggestion={suggestion} />}

          </>
        )}
        <CitySelectorModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={(newCity) => {
            setIsDetectedLocation(false);
            setSelectedCity(newCity);
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