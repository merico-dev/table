import { Group, Text, UnstyledButton } from '@mantine/core';
import { spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { ReactNode } from 'react';

const ShortcutKeyText = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      style={{
        // fontWeight: '700',
        fontSize: '0.6875rem',
        lineHeight: 1,
        padding: '0.25rem 0.2375rem',
        borderRadius: '0.25rem',
        color: '#495057',
        border: '0.0625rem solid #e9ecef',
        backgroundColor: '#f8f9fa',
      }}
    >
      {children}
    </Text>
  );
};

const isMac = (function () {
  // @ts-expect-error userAgentData
  const p = (navigator.userAgentData.platform ?? navigator.platform).toLowerCase();
  return p.includes('mac');
})();

export const SpotlightControl = () => {
  return (
    <UnstyledButton
      onClick={() => spotlight.open()}
      style={{
        width: '10rem',
        height: '2.125rem',
        background: '#fff',
        color: '#adb5bd',
        border: '0.0625rem solid #dee2e6',
        paddingLeft: '0.75rem',
        paddingRight: '0.3125rem',
        borderRadius: '0.5rem',
        fontSize: '1rem',
      }}
    >
      <Group spacing={6}>
        <IconSearch size="0.875rem" />
        <Text style={{ flexGrow: 1, fontSize: '0.875rem', lineHeight: '1.55', color: '#868e96' }}>Search</Text>
        <Group spacing={4}>
          {isMac && <ShortcutKeyText>⌘ + K</ShortcutKeyText>}
          {!isMac && <ShortcutKeyText>Ctrl + K</ShortcutKeyText>}
        </Group>
      </Group>
    </UnstyledButton>
  );
};
