import { Button, Group, AppShell, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';
import { SettingsNavLinks } from './nav-links';
import { useTranslation } from 'react-i18next';

export const SettingsNavbar = observer(() => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();

  return (
    <AppShell.Navbar
      p={0}
      sx={{
        height: '100vh - 60px - 60px',
        '.mantine-NavLink-body': {
          wordWrap: 'break-word',
        },
      }}
    >
      <AppShell.Section
        sx={{ borderBottom: '1px solid #eee', padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-md)' }}
      >
        <Text size="sm" ta="center" sx={{ userSelect: 'none', cursor: 'default' }}>
          {t('common.titles.settings')}
        </Text>
      </AppShell.Section>

      <AppShell.Section grow sx={{ overflow: 'auto' }}>
        <SettingsNavLinks />
      </AppShell.Section>

      <AppShell.Section>
        <Group grow p="md" pt="sm" sx={{ borderTop: '1px solid #eee' }}>
          <Button size="xs" color="red" leftSection={<IconX size={18} />} onClick={() => model.editor.close()}>
            {t('common.actions.close')}
          </Button>
        </Group>
      </AppShell.Section>
    </AppShell.Navbar>
  );
});
