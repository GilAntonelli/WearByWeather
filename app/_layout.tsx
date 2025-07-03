import { DarkTheme, DefaultTheme as NavigationTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native'; // ✅ IMPORT CORRETA
import { theme } from '../styles/theme';
import { initI18n } from '../i18n';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('@lang');
        const deviceLang = Localization.getLocales()[0]?.languageTag || 'pt-BR';
        const lang = storedLang || (['pt-BR', 'pt-PT', 'en'].includes(deviceLang) ? deviceLang : 'pt-BR');

        await initI18n(lang);
      } catch (e) {
        console.error('Erro ao inicializar i18n:', e);
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!ready || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : NavigationTheme}>
        <StyledThemeProvider theme={theme}> {/* ✅ Envolve tudo aqui */}
          <Slot />
          <StatusBar style="auto" />
        </StyledThemeProvider>
      </NavigationThemeProvider>
    </PaperProvider>
  );
}

