import { LoadingOverlay } from '@mantine/core';
import { useRequest } from 'ahooks';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { APICaller } from '../../api-caller';
import { AccountContextProvider } from './account-context';

export function RequireAuth() {
  const location = useLocation();
  const { data: account, loading } = useRequest(APICaller.account.get);

  if (loading) {
    return <LoadingOverlay visible />;
  }
  if (!account) {
    const redirect_to = `${location.pathname}${location.search}`;
    window.localStorage.setItem('redirect_to', redirect_to);
    return <Navigate to={`/login?redirect_to=${redirect_to}`} replace />;
  }
  const canEdit = ['AUTHOR', 'ADMIN', 'SUPERADMIN'].includes(account.role_id);
  const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(account.role_id);
  return (
    <AccountContextProvider value={{ account, loading, canEdit, isAdmin }}>
      <Outlet />
    </AccountContextProvider>
  );
}
