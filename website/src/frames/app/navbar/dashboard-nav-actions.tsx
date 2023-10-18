import { Group, Navbar as MantineNavbar } from '@mantine/core';
import { useAccountContext } from '../../require-auth/account-context';
import { CreateDashboard } from './create-dashboard';
import { ImportDashboard } from './import-dashboard';

export const DashboardNavActions = () => {
  const { canEdit } = useAccountContext();
  if (!canEdit) {
    return null;
  }

  return (
    <MantineNavbar.Section pt="xs">
      <Group px="xs" pb="sm" sx={{ borderBottom: '1px solid #eee', '> button': { flexGrow: 1 } }}>
        <CreateDashboard />
        <ImportDashboard />
      </Group>
    </MantineNavbar.Section>
  );
};
