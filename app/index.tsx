import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryButton } from '../components/PrimaryButton';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen() {
  const router = useRouter();
  const [checkingInit, setCheckingInit] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    checkIfInitialized();
  }, []);

  const checkIfInitialized = async () => {
    try {
      const isInitialized = await AsyncStorage.getItem('isAppInitialized');
      if (isInitialized) {
        router.replace('/home');
      } else {
        setCheckingInit(false);
      }
    } catch (error) {
      console.error('Erro ao verificar inicialização:', error);
      setCheckingInit(false);
    }
  };

  const handleStart = () => router.push('/preferences');

  if (checkingInit) {
    return (
      <View style={globalStyles.centeredFullScreen}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[globalStyles.container, globalStyles.centeredEvenly]}>
        <Text style={globalStyles.titleWelcome}>Weather Wear</Text>
        <Text style={globalStyles.subtitleWelcome}>{t('intro.description')}</Text>
        <Image
          source={require('../assets/images/clothesCloud.png')}
          style={globalStyles.imageWelcome}
        />
        <PrimaryButton
          title={t('intro.button')}
          iconLeft="sunny-outline"
          onPress={handleStart}
        />
      </View>
    </>
  );
}


