import { useCreation } from 'ahooks';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SocketContextProvider } from './socket-context';

export function SocketClientFrame() {
  const token = window.localStorage.getItem('token');
  const socket = useCreation(() => {
    if (!token) {
      return null;
    }
    const s = io(import.meta.env.VITE_API_BASE_URL, {
      auth: {
        account: token,
      },
    });
    return s;
  }, [token]);

  return (
    <SocketContextProvider value={{ socket }}>
      <Outlet />
    </SocketContextProvider>
  );
}
