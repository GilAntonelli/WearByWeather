import { DarkTheme, DefaultTheme as NavigationTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native'; // ✅ IMPORT CORRETA
import { theme } from '../styles/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
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
