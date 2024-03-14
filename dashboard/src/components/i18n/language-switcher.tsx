import { useTranslation, Trans } from 'react-i18next';

import { SegmentedControl } from '@mantine/core';

export const languages = [
  { label: 'EN', value: 'en' },
  { label: '中文', value: 'zh' },
];

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  return (
    <SegmentedControl
      value={i18n.language}
      onChange={(lng) => {
        i18n.changeLanguage(lng);
      }}
      size="xs"
      data={languages}
    />
  );
};
