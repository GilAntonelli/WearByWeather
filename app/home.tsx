
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import WeatherSummaryCard from '../components/WeatherSummaryCard';
import { getWeatherByCity } from '../services/weatherService';
import { TopHeader } from '../components/TopHeader'; // certifique-se de adicionar no topo
import { spacing } from '../styles/global';
import { LookSuggestionCard } from '../components/LookSuggestionCard';
import { useEffect, useRef, useState } from 'react';
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

  } | null>(null);

  const [isCityReady, setIsCityReady] = useState(false);
  const [isDetectedLocation, setIsDetectedLocation] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    name: '',
    gender: 'masculino',
    comfort: 'neutro',
  });

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
      'Permissão necessária',
      'Para detectar automaticamente sua cidade, permita o acesso à localização nas configurações do sistema.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir Configurações',
          onPress: () => Linking.openSettings(),
        },
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
            ['masculino', 'feminino', 'unissex'].includes(prefs.gender) &&
            ['frio', 'calor', 'neutro'].includes(prefs.comfort)
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
        });

        const clima = {
          ...weather,
          genero: userPreferences.gender,
          conforto: userPreferences.comfort,
        };

        const result = getSuggestionByWeather(clima);
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


  function formatCompactLabel(name: string, state?: string, country?: string): string {
    const parts = [name];
    if (state) parts.push(state.toUpperCase());
    if (country) parts.push(country.toUpperCase());
    return parts.join(', ');
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{
          ...globalStyles.container,
          minHeight: screenHeight + 120,
          paddingBottom: 80,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!isCityReady ? (
          <>
            <Text style={globalStyles.loadingText}>
              {modalVisible ? 'Selecione uma cidade para continuar...' : 'Detectando localização...'}
            </Text>
            <PrimaryButton
              title="Tentar novamente detectar cidade"
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
              title={userPreferences.name ? `Olá, ${userPreferences.name}!` : 'Olá!'}
              renderAnchor={() => (
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                      <Ionicons name="settings-outline" style={globalStyles.gearIcon} />

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
                      router.push('/language-selector');
                    }}
                    title="Linguagem"
                    leadingIcon="globe-outline"
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
              )}
            />


            <TouchableOpacity
              style={globalStyles.fakeSearchInput}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="search" size={18} color="#999" style={{ marginRight: 8 }} />
              <Text style={globalStyles.fakeSearchText}>Buscar cidade</Text>
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
              />
            )}
            <Text style={[globalStyles.cardTitle, {
              marginTop: spacing.section
            }]}>
              Look Sugerido do Dia
            </Text>

{suggestion && <LookSuggestionCard suggestion={suggestion} />}

{/*
            {suggestion && (
              <View style={[globalStyles.cardhome, {
                marginTop: spacing.section
              }]}>
                <View style={globalStyles.suggestionWrapper}>
                  <View style={{ flex: 1 }}>
                    <Text style={globalStyles.lookText}>{suggestion.recomendação}</Text>
                    <Image
                      source={suggestion.image}
                      style={globalStyles.avatar}
                      resizeMode="contain"
                    />

                    <View style={globalStyles.tagRow}>
                      <View style={globalStyles.tag}>
                        <Text style={globalStyles.tagText}>{suggestion.roupaSuperior}</Text>

                      </View>
                      <View style={globalStyles.tag}>
                        <Text style={globalStyles.tagText}>{suggestion.roupaInferior}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={globalStyles.accessoryColumn}>
                    <Text style={globalStyles.accessoryTitle}>Acessórios</Text>
                    {suggestion.acessórios?.map((item, i) => {
                      const icon = accessoryImages[item as keyof typeof accessoryImages];
                      if (!icon) return null;

                      function formatCompactLabel(name: string, state?: string, country?: string): string {
                        const parts = [name];
                        if (state) parts.push(state.toUpperCase());
                        if (country) parts.push(country.toUpperCase());
                        return parts.join(', ');
                      }


                      return (
                        <View key={i} style={globalStyles.accessoryIconWrapper}>
                          <Image source={icon} style={globalStyles.accessoryIcon} resizeMode="contain" />
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
*/}

            <PrimaryButton
              title="Ver previsão detalhada"
              onPress={() => router.push('/forecast')}
  style={{ marginTop: spacing.bottomButton }}
            />
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
    </SafeAreaView>
  );
}