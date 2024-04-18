import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import 'intl-pluralrules';
import { en } from './en';
import { zh } from './zh';
import { vizList } from '~/components/plugins';

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

vizList.forEach((viz) => {
  viz.translation?.forEach((t) => {
    i18n.addResourceBundle(t.lang, 'translation', { viz: t.resources }, true, true);
  });
});
export default i18n;
