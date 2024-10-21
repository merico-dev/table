import { SegmentedControl } from '@mantine/core';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Language, useLanguageContext } from '../contexts';

const locales = {
  'zh-cn': import('dayjs/locale/zh-cn'),
  en: import('dayjs/locale/en'),
};

export const languages: { label: string; value: Language }[] = [
  { label: 'EN', value: 'en' },
  { label: '中文', value: 'zh' },
];

function setDayjsLocale(lang: Language) {
  const locale = lang === 'zh' ? 'zh-cn' : 'en';
  locales[locale].then((res) => {
    dayjs.locale(locale, { ...res, weekStart: 1 }, false);
  });
}

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguageContext();

  useEffect(() => {
    setDayjsLocale(lang);
  }, [lang]);

  const handleChange = (v: string) => {
    setLang(v as Language);
  };
  return <SegmentedControl value={lang} onChange={handleChange} size="xs" data={languages} />;
};
