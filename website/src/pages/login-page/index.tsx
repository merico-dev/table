import { ILoginResp, Login } from '@devtable/settings-form';
import { Center, LoadingOverlay } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useRequest } from 'ahooks';
import { Navigate, useNavigate } from 'react-router-dom';
import { APICaller } from '../../api-caller';
import { SettingsFormConfig } from '../../utils/config';

export function LoginPage() {
  const navigate = useNavigate();
  const { data: account, loading, ...rest } = useRequest(APICaller.account.get);

  const redirect_to = window.localStorage.getItem('redirect_to') ?? '/dashboard/';

  const onSuccess = ({ account, token }: ILoginResp) => {
    window.localStorage.setItem('token', token);
    navigate(redirect_to);
  };

  if (account) {
    return <Navigate to={redirect_to} replace />;
  }

  return (
    <Center sx={{ width: '100vw', height: '100vh' }}>
      <Notifications position="top-right" />
      <LoadingOverlay visible={loading} />
      <Login config={SettingsFormConfig} onSuccess={onSuccess} />
    </Center>
  );
}
