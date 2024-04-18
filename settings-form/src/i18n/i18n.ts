import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import 'intl-pluralrules';
import { en } from './en';
import { zh } from './zh';

const i18n = createInstance({
  debug: false,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en,
    zh,
  },
})
  .use(LanguageDetector)
  .use(initReactI18next);

i18n.init();
export default i18n;
