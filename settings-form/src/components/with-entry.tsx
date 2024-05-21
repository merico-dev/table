import { Suspense } from 'react';
import { configureAPIClient } from '../api-caller/request';
import { I18nextContextProvider } from '../i18n/i18next-context';
import { useLoadMonacoEditor } from '../utils/load-monaco-editor';
import { Loader } from '@mantine/core';

type EntryProps = {
  lang: string;
  config: ISettingsFormConfig;
};
export function withEntry<T extends object>(displayName: string, Component: React.ComponentType<T>) {
  const Entry = (props: T & EntryProps) => {
    const { lang, config, ...rest } = props;

    configureAPIClient(config);
    useLoadMonacoEditor(config.monacoPath);
    return (
      <Suspense fallback={<Loader color="gray" />}>
        <I18nextContextProvider lang={lang}>
          <Component {...(rest as T)} />
        </I18nextContextProvider>
      </Suspense>
    );
  };

  Entry.displayName = `withEntry(${displayName})`;

  return Entry;
}
