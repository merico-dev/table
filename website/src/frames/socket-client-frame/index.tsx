import { useBoolean, useCreation } from 'ahooks';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SocketContextProvider } from './socket-context';

export function SocketClientFrame() {
  const token = window.localStorage.getItem('token');
  const socket = useCreation(() => {
    const s = io(import.meta.env.VITE_API_BASE_URL, {
      auth: {
        account: token,
      },
    });
    return s;
  }, [token]);

  const [isConnected, { setTrue, setFalse }] = useBoolean(socket.connected);

  useEffect(() => {
    socket.on('connect', setTrue);
    socket.on('disconnect', setFalse);

    return () => {
      socket.off('connect', setTrue);
      socket.off('disconnect', setFalse);
    };
  }, [socket]);

  console.log({ isConnected });
  return (
    <SocketContextProvider value={{ socket }}>
      <Outlet />
    </SocketContextProvider>
  );
}
