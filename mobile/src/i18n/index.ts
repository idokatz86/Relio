/**
 * i18n Configuration
 *
 * Issue #137: react-i18next + expo-localization scaffold.
 * Supports: English (default), Spanish, Portuguese (BR), Hebrew (RTL).
 *
 * Usage in components:
 *   import { useTranslation } from 'react-i18next';
 *   const { t } = useTranslation();
 *   <Text>{t('login.title')}</Text>
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import he from './locales/he.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  pt: { translation: pt },
  he: { translation: he },
};

// Detect device language, fall back to 'en'
function getDeviceLanguage(): string {
  try {
    const locales = getLocales();
    if (locales.length > 0) {
      const lang = locales[0].languageCode;
      if (lang && lang in resources) return lang;
    }
  } catch {
    // Fallback if expo-localization unavailable
  }
  return 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    compatibilityJSON: 'v4',
  });

export default i18n;
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
];
