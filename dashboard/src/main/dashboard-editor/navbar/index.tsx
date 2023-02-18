import { Button, Group, Navbar as MantineNavbar, Text } from '@mantine/core';
import { IconSettings } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';

export function DashboardEditorNavbar() {
  const navigate = useNavigate();

  return (
    <MantineNavbar p="md" width={{ base: 200 }}>
      <MantineNavbar.Section>
        <Group grow pb="md" position="apart">
          <Text align="center">F</Text>
          <Text align="center">D</Text>
          <Text align="center">I</Text>
        </Group>
      </MantineNavbar.Section>

      <MantineNavbar.Section grow>TODO:Views</MantineNavbar.Section>

      <MantineNavbar.Section>
        <Group grow pt="sm" sx={{ borderTop: '1px solid #eee' }}>
          <Button size="sm" leftIcon={<IconSettings size={20} />}>
            Settings
          </Button>
        </Group>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}
