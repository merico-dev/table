import { Button, Group, Navbar as MantineNavbar, Text } from '@mantine/core';
import { IconX } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { SettingsNavLinks } from './nav-links';

export const SettingsNavbar = observer(() => {
  const model = useModelContext();

  return (
    <MantineNavbar p={0} width={{ base: 300 }}>
      <MantineNavbar.Section grow sx={{ width: '100%', overflow: 'auto' }}>
        <Text mt={15} mb={-5} align="center" sx={{ userSelect: 'none', cursor: 'default' }}>
          Settings
        </Text>
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
