import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { useRouter } from 'expo-router';
import i18n from 'i18next';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../styles/global';
import { theme } from '../styles/theme';

const LANGUAGE_KEY = '@lang';

const languages = [
  { code: 'auto', labelKey: 'language.auto', icon: '🌍' },
  { code: 'pt-BR', label: 'Português (Brasil)', icon: '🇧🇷' },
  { code: 'pt-PT', label: 'Português (Portugal)', icon: '🇵🇹' },
  { code: 'en', label: 'English', icon: '🇺🇸' },
];

export default function LanguageSelector() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then(stored => {
      setSelected(stored || 'auto');
    });
  }, []);

  const changeLanguage = async (code: string) => {
    if (code === 'auto') {
      const deviceLang = Localization.getLocales()[0].languageTag;
      const supported = ['pt-BR', 'pt-PT', 'en'];
      const fallback = supported.includes(deviceLang) ? deviceLang : 'pt-BR';
      await i18n.changeLanguage(fallback);
      await AsyncStorage.removeItem(LANGUAGE_KEY);
    } else {
      await i18n.changeLanguage(code);
      await AsyncStorage.setItem(LANGUAGE_KEY, code);
    }

    setSelected(code);
    router.back();
  };

  return (
    <View style={globalStyles.wrapper}>
      <Text style={globalStyles.emoji}>🌐</Text>
      <Text style={globalStyles.title}>{t('language.title')}</Text>

      {languages.map(lang => {
        const label = lang.label || t(lang.labelKey || '');
        const isActive = selected === lang.code;

        return (
          <TouchableOpacity
            key={lang.code}
            style={[globalStyles.langButton, isActive && globalStyles.langButtonActive]}
            onPress={() => changeLanguage(lang.code)}
          >
            <Text style={[globalStyles.langText, isActive && globalStyles.langTextActive]}>
              {lang.icon}  {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
