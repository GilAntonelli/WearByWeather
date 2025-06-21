import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryButton } from '../components/PrimaryButton';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [checkingInit, setCheckingInit] = useState(true);

  useEffect(() => {
    const checkIfInitialized = async () => {
      try {
        const isInitialized = await AsyncStorage.getItem('isAppInitialized');

        if (isInitialized) {
          router.replace('/home'); // pula tela de boas-vindas se já usou
        } else {
          setCheckingInit(false); // libera exibição da tela de boas-vindas
        }
      } catch (error) {
        console.error('Erro ao verificar inicialização:', error);
        setCheckingInit(false); // mostra tela mesmo se falhar
      }
    };

    checkIfInitialized();
  }, []);

  if (checkingInit) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      {/* Oculta o cabeçalho padrão (o "index" no topo) */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[globalStyles.container, styles.centered]}>
        {/* Título com hierarquia visual aprimorada */}
        <Text style={globalStyles.title}>Weather Wear</Text>

        {/* Subtítulo mais leve e elegante */}
        <Text style={globalStyles.subtitleWelcome}>
          O clima muda. Seu estilo se adapta.{"\n"}
          Receba sugestões de looks com base no clima em tempo real.
        </Text>

        {/* Ilustração */}
        <Image
          source={require('../assets/images/clothesCloud.png')}
          style={globalStyles.imageWelcome}
        />

        {/* Botão principal com ícone */}
        <PrimaryButton
          title="Ver Sugestão do Dia"
          iconLeft="sunny-outline"
          onPress={() => router.push('/preferences')}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
