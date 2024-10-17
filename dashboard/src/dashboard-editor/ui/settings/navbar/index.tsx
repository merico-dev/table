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
      width={{ base: 220, xs: 220, sm: 240, md: 260, lg: 300, xl: 320 }}
      sx={{
        height: '100vh - 60px - 60px',
        '.mantine-NavLink-body': {
          wordWrap: 'break-word',
        },
      }}
    >
      <AppShell.Section pt={9} pb={8} sx={{ borderBottom: '1px solid #eee' }}>
        <Text align="center" sx={{ userSelect: 'none', cursor: 'default' }}>
          {t('common.titles.settings')}
        </Text>
      </AppShell.Section>

      <AppShell.Section grow sx={{ overflow: 'auto' }}>
        <SettingsNavLinks />
      </AppShell.Section>

      <AppShell.Section>
        <Group grow p="md" pt="sm" sx={{ borderTop: '1px solid #eee' }}>
          <Button size="xs" color="red" leftIcon={<IconX size={18} />} onClick={() => model.editor.close()}>
            {t('common.actions.close')}
          </Button>
        </Group>
      </AppShell.Section>
    </AppShell.Navbar>
  );
});
