import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import 'intl-pluralrules';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          query_one: 'Query',
          query_other: 'Queries',
          'Download this View': 'Download this View',
        },
      },
      zh: {
        translation: {
          query_one: '查询',
          query_other: '查询',
          'Download this View': '截屏此视图',
        },
      },
    },
  });

export default i18n;
