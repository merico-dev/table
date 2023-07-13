import { Button, Group, Navbar as MantineNavbar, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { SettingsNavLinks } from './nav-links';

export const SettingsNavbar = observer(() => {
  const model = useModelContext();

  return (
    <MantineNavbar
      p={0}
      width={{ base: 200, xs: 200, sm: 220, md: 240, lg: 280, xl: 300 }}
      sx={{ height: '100vh - 60px - 60px' }}
    >
      <MantineNavbar.Section pt={9} pb={8} sx={{ borderBottom: '1px solid #eee' }}>
        <Text align="center" sx={{ userSelect: 'none', cursor: 'default' }}>
          Settings
        </Text>
      </MantineNavbar.Section>

      <MantineNavbar.Section grow sx={{ overflow: 'auto' }}>
        <SettingsNavLinks />
      </MantineNavbar.Section>

      <MantineNavbar.Section>
        <Group grow p="md" pt="sm" sx={{ borderTop: '1px solid #eee' }}>
          <Button size="xs" color="red" leftIcon={<IconX size={18} />} onClick={() => model.editor.close()}>
            Close
          </Button>
        </Group>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
});
