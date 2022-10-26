import { LoadingOverlay } from '@mantine/core';
import { useRequest } from 'ahooks';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AccountAPI } from '../../api-caller/account';
import { AccountContextProvider } from './account-context';

export function RequireAuth() {
  const location = useLocation();
  const { data: account, loading } = useRequest(AccountAPI.get);

  if (loading) {
    return <LoadingOverlay visible />;
  }
  if (!account) {
    const redirect_to = `${location.pathname}${location.search}`;
    window.localStorage.setItem('redirect_to', redirect_to);
    return <Navigate to={`/login?redirect_to=${redirect_to}`} replace />;
  }
  const canEdit = account.role_id >= 30; // AUTHOR | ADMIN | SUPERADMIN
  const isAdmin = account.role_id >= 40; // AUTHOR | ADMIN | SUPERADMIN
  return (
    <AccountContextProvider value={{ account, loading, canEdit, isAdmin }}>
      <Outlet />
    </AccountContextProvider>
  );
}
