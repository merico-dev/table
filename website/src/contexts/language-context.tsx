import { useLocalStorage } from '@mantine/hooks';
import _ from 'lodash';
import React, { ReactNode } from 'react';

export type Language = 'en' | 'zh';
export const DEFAULT_LANGUAGE: Language = 'en';
const LANGUAGE_KEY = '@devtable/website/lang';

export type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const initialContext = {
  lang: DEFAULT_LANGUAGE,
  setLang: _.noop,
};

export const LanguageContext = React.createContext<LanguageContextType>(initialContext);

export function LanguageContextProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage({ key: LANGUAGE_KEY, defaultValue: DEFAULT_LANGUAGE });

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export const useLanguageContext = () => {
  return React.useContext(LanguageContext);
};
