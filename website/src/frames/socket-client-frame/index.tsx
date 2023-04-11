import { useCreation } from 'ahooks';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SocketContextProvider } from './socket-context';
import { useEffect } from 'react';

function getSocketURL() {
  try {
    const url = import.meta.env.VITE_API_BASE_URL;
    const path = new URL(url).pathname + 'socket.io';
    return { url, path };
  } catch (error) {
    const url = new URL(window.location.origin + import.meta.env.VITE_API_BASE_URL);
    const path = url.pathname + 'socket.io';
    return { url, path };
  }
}

const { url, path } = getSocketURL();

export function SocketClientFrame() {
  const token = window.localStorage.getItem('token');
  const socket = useCreation(() => {
    if (!token) {
      return null;
    }
    const options = {
      path,
      auth: {
        account: token,
      },
    };
    return io(url, options);
  }, [token]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onConnect = () => console.log('Socket connected');
    const onDisconnect = () => console.log('Socket disconnected');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  return (
    <SocketContextProvider value={{ socket }}>
      <Outlet />
    </SocketContextProvider>
  );
}
