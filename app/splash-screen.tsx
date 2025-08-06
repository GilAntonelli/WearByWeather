import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../styles/theme';
import { globalStyles } from '@/styles/global';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/welcome');
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={globalStyles.containerSplash}>
      <Image
        source={require('../assets/images/clothesCloud.png')}
        style={globalStyles.logo}
      />
      <Text style={globalStyles.titleSplash}>Weather Wear</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 24 }} />
    </View>
  );
}
