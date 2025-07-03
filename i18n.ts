import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './locales/pt-BR/translation.json';
import ptPT from './locales/pt-PT/translation.json';
import en from './locales/en/translation.json';

i18n.use(initReactI18next);

export async function initI18n(language: string) {
  await i18n.init({
    compatibilityJSON: 'v4',
    lng: language,
    fallbackLng: 'pt-BR',
    resources: {
      'pt-BR': { translation: ptBR },
      'pt-PT': { translation: ptPT },
      en: { translation: en }
    },
    interpolation: { escapeValue: false }
  });
}

export default i18n;