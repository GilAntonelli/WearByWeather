
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import { getWeatherByCity } from '../services/weatherService';
import { getPreferredCityName } from '../utils/getPreferredCityName';


import { useEffect, useState, useRef } from 'react';
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
import { getFraseClimatica } from '../services/weatherPhrases';

import * as Location from 'expo-location';
import { CitySelectorModal } from '../components/CitySelectorModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { accessoryImages } from '../constants/accessoryImages';
import { getSuggestionByWeather } from '../services/suggestionEngine';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import { UserPreferences } from '../types/preferences';
import { LookSuggestion } from '../types/suggestion';
import { getdetectedCity } from '../services/LocationService';

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


  } | null>(null);

  const [isCityReady, setIsCityReady] = useState(false);
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
        const prefsString = await AsyncStorage.getItem('@user_preferences');
        if (!prefsString) return;

        const prefs: UserPreferences = JSON.parse(prefsString);
        setUserPreferences(prefs);

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
        console.log('Cidade usada na API:', raw);
        const weather = await getWeatherByCity(raw);
        console.log('Dados de clima recebidos:', weather);

        if (!weather) {
          console.warn('Não foi possível obter dados reais do clima.');
          return;
        }

        // ✅ Aqui atualiza o weatherData corretamente
        setWeatherData({
          temperatura: weather.temperatura,
          sensacaoTermica: weather.sensacaoTermica,
          condicao: weather.condicao,

          chuva: weather.chuva,
          vento: weather.vento,
          icon: weather.icon, // <- ADICIONE ESSA LINHA
        });

        const clima = {
          ...weather,
          genero: prefs.gender,
          conforto: prefs.comfort,
        };

        const result = getSuggestionByWeather(clima);
        setSuggestion(result);
            } catch (e) {
        console.error('Erro ao carregar sugestão com clima real:', e);
      } finally {
      isLoadingRef.current = false;
    }
  };

  if (isCityReady && city) {
      loadSuggestion();
    }
  }, [isCityReady, city]);

  useEffect(() => {
    const loadCity = async () => {
      const granted = await detectCityFromLocation();
      if (!granted) {
        setModalVisible(true);
      } else {
        setIsCityReady(true);
      }
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
            <View style={globalStyles.homeHeader}>
              <Text style={globalStyles.homeTitle}>
                {userPreferences.name ? `Olá, ${userPreferences.name}!` : 'Olá!'}
              </Text>
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

            <View style={globalStyles.locationBox}>
              <Ionicons name="location-outline" size={18} color={theme.colors.textDark} />
              <Text style={globalStyles.locationText}>{city}</Text>
              <TouchableOpacity
                style={globalStyles.changeButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={globalStyles.changeButtonText}>Alterar</Text>
              </TouchableOpacity>
            </View>

            <View style={globalStyles.cardhome}>
              <View style={globalStyles.weatherRow}>
                <View>
                  {weatherData ? (
                    <View>
                      <Text style={globalStyles.weatherMain}>{weatherData.temperatura}°C</Text>
                      <Text style={globalStyles.weatherSecondary}>
                        Sensação de {weatherData.sensacaoTermica}°C
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text style={globalStyles.weatherMain}>–</Text>
                      <Text style={globalStyles.weatherSecondary}>Carregando...</Text>
                    </View>
                  )}
                </View>
                <View style={{ alignItems: 'center' }}>
                  {weatherData?.icon ? (
                    <Image
                      source={{ uri: `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png` }}
                      style={{ width: 48, height: 48 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Feather name="sun" size={32} color="#FFC300" />
                  )}
                  <Text style={globalStyles.weatherLabel}>
                    {weatherData?.condicao || 'Clima indefinido'}
                  </Text>
                </View>

              </View>

              <View style={globalStyles.weatherInfoRow}>

                <Text style={globalStyles.weatherInfo}>
                  {weatherData ? getFraseClimatica(weatherData) : 'Carregando...'}
                </Text>
                <Text style={globalStyles.weatherInfo}>
                  Vento: {weatherData?.vento ? `${weatherData.vento} km/h` : '–'}
                </Text>
              </View>
            </View>

            <Text style={globalStyles.cardTitle}>Look Sugerido do Dia</Text>

            {suggestion && (
              <View style={globalStyles.cardhome}>
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

            <PrimaryButton
              title="Ver previsão detalhada"
              onPress={() => router.push('/forecast')}
              style={{ marginTop: 32 }}
            />
          </>
        )}
        <CitySelectorModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={(newCity) => {
            setSelectedCity(newCity);
            setModalVisible(false);
            setIsCityReady(true);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}