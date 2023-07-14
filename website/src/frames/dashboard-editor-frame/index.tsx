import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Navigate, Outlet } from 'react-router-dom';
import { DashboardStoreProvider } from '../app/models/dashboard-store-context';
import { useAccountContext } from '../require-auth/account-context';

export function DashboardEditorFrame() {
  const { canEdit } = useAccountContext();
  if (!canEdit) {
    return <Navigate to="/" replace />;
  }
  return (
    <DashboardStoreProvider>
      <MantineProvider
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
        <Notifications position="top-right" />
        <Outlet />
      </MantineProvider>
    </DashboardStoreProvider>
  );
}
