// screens/index.tsx
import { Stack } from 'expo-router';
import React, { useEffect, useState }  from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../components/PrimaryButton';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';
import { useInitCheck } from '../hooks/useInitCheck';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initI18n } from '../i18n';

const imageWelcome = require('../assets/images/clothesCloud.png');

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { checking } = useInitCheck();
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    const setupLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('@lang');
      const lang = storedLang || 'pt-BR';
      console.log('Inicializando I18N:', lang);
      await initI18n(lang);
      setLanguageReady(true);
    };
    setupLanguage();
  }, []);

  const handleStart = () => router.push('/preferences');

  if (checking || !languageReady) {
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
        <Text style={globalStyles.subtitleWelcome}>
          {t('intro.description')}
        </Text>

        <Image source={imageWelcome} style={globalStyles.imageWelcome} />

        <PrimaryButton
          title={t('intro.button')}
          iconLeft="sunny-outline"
          onPress={handleStart}
        />
      </View>
    </>
  );
}
