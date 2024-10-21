import { Button, AppShell } from '@mantine/core';
import { useAccountContext } from '../../require-auth/account-context';
import { CreateDashboard } from './create-dashboard';
import { ImportDashboard } from './import-dashboard';

export const DashboardNavActions = () => {
  const { canEdit } = useAccountContext();
  if (!canEdit) {
    return null;
  }

  return (
    <AppShell.Section>
      <Button.Group
        sx={{
          width: '100%',
          borderBottom: '1px solid #eee',
          '> button ': {
            borderRadius: 0,
            flexGrow: 1,
          },
        }}
      >
        <CreateDashboard />
        <ImportDashboard />
      </Button.Group>
    </AppShell.Section>
  );
};
