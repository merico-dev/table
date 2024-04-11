import { ReactNode, useMemo } from 'react';
import { DatesProvider as MantineDatesProvider } from '@mantine/dates';
import { useTranslation } from 'react-i18next';

const lang2dayjsLocale = {
  en: 'en',
  zh: 'zh-cn',
};
export function DatesProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const locale = useMemo(() => {
    const lang = i18n.language as 'zh' | 'en';
    return lang2dayjsLocale[lang] ?? 'en';
  }, [i18n.language]);

  return <MantineDatesProvider settings={{ locale, firstDayOfWeek: 1 }}>{children}</MantineDatesProvider>;
}
