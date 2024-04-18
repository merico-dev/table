import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useApplyLanguage(lang: string) {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
}
