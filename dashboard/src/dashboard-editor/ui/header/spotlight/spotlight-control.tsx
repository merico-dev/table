import { Group, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const ShortcutKeyText = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      style={{
        fontSize: '0.6875rem',
        lineHeight: 1,
        padding: '0.25rem 0.2375rem',
        borderRadius: '0.25rem',
      }}
    >
      {children}
    </Text>
  );
};

const isMac = (function () {
  // @ts-expect-error userAgentData
  const p = (navigator.userAgentData?.platform ?? navigator.platform).toLowerCase();
  return p.includes('mac');
})();

export const SpotlightControl = () => {
  const { t } = useTranslation();
  return (
    <Tooltip
      label={
        <>
          {isMac && <ShortcutKeyText>⌘ + K</ShortcutKeyText>}
          {!isMac && <ShortcutKeyText>Ctrl + K</ShortcutKeyText>}
        </>
      }
    >
      <UnstyledButton
        onClick={() => spotlight.open()}
        style={{
          height: '1.875rem',
          borderLeft: 'none',
          borderTop: 'none',
          borderRight: '1px solid #e9ecef',
          borderBottom: '1px solid #e9ecef',
          paddingLeft: 'calc(0.875rem  / 1.5)',
          paddingRight: '1rem',
        }}
        sx={{
          color: '#228be6',
          background: 'transparent',
          '&:hover': {
            background: 'rgb(231, 245, 255)',
          },
        }}
      >
        <Group gap={'0.625rem'}>
          <IconSearch size="1rem" color="#228be6" />
          <Text style={{ flexGrow: 1, fontWeight: 500, fontSize: '0.75rem', lineHeight: 1 }}>
            {t('spotlight.trigger_text')}
          </Text>
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
};
