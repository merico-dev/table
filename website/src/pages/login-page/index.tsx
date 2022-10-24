import { Login, ILoginResp } from '@devtable/settings-form';
import { Box, Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();
  const onSuccess = ({ account, token }: ILoginResp) => {
    window.localStorage.setItem('token', token);
    navigate('/');
  };
  return (
    <Center sx={{ width: '100vw', height: '100vh' }}>
      <Login config={{ apiBaseURL: import.meta.env.VITE_API_BASE_URL }} onSuccess={onSuccess} />
    </Center>
  );
}
