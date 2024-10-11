import { MantineProvider } from '@mantine/core';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { ReactNode } from 'react';
import '@mantine/code-highlight/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

export function MantineProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      stylesTransform={emotionTransform}
      theme={{
        breakpoints: {
          xs: '85em',
          sm: '90em',
          md: '96em',
          lg: '100em',
          xl: '120em',
        },
      }}
    >
      <MantineEmotionProvider>{children}</MantineEmotionProvider>
    </MantineProvider>
  );
}
