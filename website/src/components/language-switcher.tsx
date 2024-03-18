import { SegmentedControl } from '@mantine/core';
import { useLanguageContext } from '../contexts';

export const languages = [
  { label: 'EN', value: 'en' },
  { label: '中文', value: 'zh' },
];

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguageContext();

  return <SegmentedControl value={lang} onChange={setLang} size="xs" data={languages} />;
};
