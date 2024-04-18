import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export function I18nextContextProvider({ lang, children }: { lang: string; children: ReactNode }) {
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
