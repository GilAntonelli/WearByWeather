import InfoIconText from '../components/ui/InfoIconText';

import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { BackButton } from '../components/ui/BackButton';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';

const screenHeight = Dimensions.get('window').height;

export const options = {
  headerShown: false,
};

export default function PreferencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [stylePreference, setStylePreference] = useState<'feminino' | 'masculino' | 'unissex' | null>(null);

  const [comfort, setComfort] = useState<'frio' | 'calor' | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [touchedName, setTouchedName] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await AsyncStorage.getItem('@user_preferences');
        if (saved) {
          const prefs = JSON.parse(saved);
          setName(prefs.name);
          setStylePreference(prefs.stylePreference);
          setComfort(prefs.comfort);
        }
      } catch (e) {
        console.error('Erro ao carregar preferências:', e);
      }
    };

    loadPreferences();
  }, []);

  const handleInfoPress = () => {
    Alert.alert(
      'Preferências editáveis',
      'Você poderá alterar suas preferências a qualquer momento acessando o menu de configurações.'
    );
  };

  const handleSave = async () => {
    if (!stylePreference || !comfort) {
      alert('Por favor, selecione o estilo e a temperatura de conforto.');
      return;
    }

    const prefs = { name, gender: stylePreference, comfort };


    try {
      await AsyncStorage.setItem('@user_preferences', JSON.stringify(prefs));
      router.push('/home');
    } catch (e) {
      console.error('Erro ao salvar preferências:', e);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        position: 'relative',
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              paddingTop: 24,
              paddingBottom: 160,
              backgroundColor: theme.colors.background,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={globalStyles.contentWrapper}>
              <BackButton />
              <Text style={[globalStyles.title, { marginBottom: 16 }]}>
                Suas Preferências
              </Text>
              <Text style={globalStyles.description}>
                Vamos personalizar sua experiência!
              </Text>

              <Text style={[globalStyles.description, globalStyles.subtitleWelcomeStrong, { marginTop: 4 }]}>
                Essas informações nos ajudarão a recomendar roupas que combinam com seu estilo.
              </Text>


              <InfoIconText
                text="Você poderá editar essas preferências mais tarde."
                marginTop={0}
                marginBottom={24}
              />



              {/* Nome */}
              <View style={[globalStyles.section, { marginBottom: 16 }]}>
                <Text style={globalStyles.sectionTitle}>Nome ou apelido (opcional)</Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    placeholder="Como prefere ser chamado(a)?"
                    placeholderTextColor={theme.colors.textLight}
                    style={[
                      globalStyles.input,
                      isFocused && globalStyles.inputFocused,
                      globalStyles.inputGap, // novo
                      { paddingRight: 40 }
                    ]}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (!touchedName) setTouchedName(true);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      setIsFocused(false);
                      setTouchedName(true);
                    }}
                  />
                  {isFocused && (
                    <Ionicons
                      name="pencil"
                      size={16}
                      color={theme.colors.textLight}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        marginTop: -8,
                      }}
                    />

                  )}
                </View>


                <InfoIconText
                  text="Você pode deixar esse campo em branco se preferir não ser chamado pelo nome."
                  marginTop={globalStyles.infoTextSpacing.marginTop}
                  marginBottom={globalStyles.infoTextSpacing.marginBottom}
                />

              </View>

              {/* Gênero */}
              <View style={[globalStyles.section, globalStyles.sectionSpacing]}>
                <Text style={globalStyles.sectionTitle}>Estilo de vestuário preferido</Text>
                <View style={[globalStyles.preferenceCardContainer, globalStyles.cardGroupSpacing]}>
                  <OptionCard
                    label="Masculino"
                    selected={stylePreference === 'masculino'}
                    icon={<FontAwesome5 name="male" style={globalStyles.preferenceCardIcon} />}
                    onPress={() => setStylePreference('masculino')}
                  />
                  <OptionCard
                    label="Feminino"
                    selected={stylePreference === 'feminino'}
                    icon={<FontAwesome5 name="female" style={globalStyles.preferenceCardIcon} />}
                    onPress={() => setStylePreference('feminino')}
                  />
                  <OptionCard
                    label="Unissex"
                    selected={stylePreference === 'unissex'}
                    icon={<FontAwesome5 name="user-friends" style={globalStyles.preferenceCardIcon} />}
                    onPress={() => setStylePreference('unissex')}
                  />
                </View>
                {stylePreference === null && (
                  <InfoIconText
                    text="Usaremos essa informação para sugerir looks que mais se adequem ao seu estilo."
                    marginTop={globalStyles.infoTextSpacing.marginTop}
                    marginBottom={globalStyles.infoTextSpacing.marginBottom}
                  />
                )}
                {!stylePreference && (
                  <InfoIconText
                    text="Usaremos essa informação para sugerir looks que mais se adequem ao seu estilo."
                    marginTop={globalStyles.infoTextSpacing.marginTop}
                    marginBottom={globalStyles.infoTextSpacing.marginBottom}
                  />
                )}

                {stylePreference === 'masculino' && (
                  <InfoIconText
                    text="Sugestões com bermuda, camisa polo, etc."
                    marginTop={globalStyles.infoTextSpacing.marginTop}

                    marginBottom={globalStyles.infoTextSpacing.marginBottom}
                  />
                )}

                {stylePreference === 'feminino' && (
                  <InfoIconText
                    text="Sugestões com vestidos, saias, etc."
                    marginTop={0}
                    marginBottom={20}
                  />
                )}

                {stylePreference === 'unissex' && (
                  <InfoIconText
                    text="Roupas neutras como jeans, t-shirt, etc."
                    marginTop={0}
                    marginBottom={20}
                  />
                )}



              </View>

              {/* Temperatura de conforto */}
              <View style={globalStyles.section}>
                <Text style={globalStyles.sectionTitle}>Temperatura de conforto</Text>

                <View style={globalStyles.preferenceCardContainer}>
                  <OptionCard
                    label="Prefiro me agasalhar mais"
                    selected={comfort === 'frio'}
                    icon={<Ionicons name="snow" style={globalStyles.preferenceCardIcon} />}
                    onPress={() => setComfort('frio')}
                  />
                  <OptionCard
                    label="Sinto muito calor"
                    selected={comfort === 'calor'}
                    icon={<Ionicons name="sunny" style={globalStyles.preferenceCardIcon} />}
                    onPress={() => setComfort('calor')}
                  />
                </View>

                {comfort === null && (
                  <InfoIconText
                    text="Essa informação nos ajuda a ajustar as roupas conforme sua sensibilidade térmica."
                    marginTop={0}
                    marginBottom={20}
                  />
                )}
                {comfort === 'frio' && (
                  <InfoIconText
                    text="Você geralmente sente frio com facilidade."
                    marginTop={0}
                    marginBottom={20}
                  />
                )}
                {comfort === 'calor' && (
                  <InfoIconText
                    text="Você prefere roupas mais leves e frescas."
                    marginTop={0}
                    marginBottom={20}
                  />
                )}
              </View>


            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        {/* Botão fixo */}
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
            title="Salvar preferências e continuar"
            onPress={handleSave}
            accessibilityLabel="Salvar preferências"
            accessibilityRole="button"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function OptionCard({ label, selected, icon, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      style={[
        globalStyles.preferenceCard,
        selected && {
          borderColor: theme.colors.primary,
          backgroundColor: '#fff9e5',
        },
      ]}
    >
      {icon}
      <Text style={globalStyles.preferenceCardText}>{label}</Text>
    </TouchableOpacity>
  );
}

function OptionBlock({ label, description, selected, icon, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        globalStyles.block,
        selected && globalStyles.comfortBlockSelected,
      ]}
    >
      <View style={globalStyles.blockHeader}>
        {icon && (
          <View style={{ marginRight: 6 }}>
            {typeof icon === 'string' ? <Text>{icon}</Text> : icon}
          </View>
        )}
        <Ionicons
          name={selected ? 'checkbox' : 'checkbox-outline'}
          size={20}
          color={selected ? theme.colors.background : theme.colors.textLight}
          style={{
            backgroundColor: selected ? theme.colors.primary : 'transparent',
            borderRadius: 4,
            padding: 2,
            marginRight: 6,
          }}
        />
        <Text
          style={[
            globalStyles.blockLabel,
            selected && { color: theme.colors.textDark },
          ]}
        >
          {label}
        </Text>
      </View>
      <Text
        style={[
          globalStyles.blockDesc,
          selected && { color: theme.colors.text },
        ]}
      >
        {description}
      </Text>
    </Pressable>
  );
}
