import { ILoginResp, Login } from '@devtable/settings-form';
import { Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();
  const onSuccess = ({ account, token }: ILoginResp) => {
    window.localStorage.setItem('token', token);
    const redirect_to = window.localStorage.getItem('redirect_to') ?? '/';
    navigate(redirect_to);
  };
  return (
    <Center sx={{ width: '100vw', height: '100vh' }}>
      <Login config={{ apiBaseURL: import.meta.env.VITE_API_BASE_URL }} onSuccess={onSuccess} />
    </Center>
  );
}
