import { useCreation } from 'ahooks';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Manager } from 'socket.io-client';
import { SocketContextProvider } from './socket-context';

function getSocketURL(baseURL: string) {
  try {
    const url = baseURL;
    const path = new URL(url).pathname + 'socket.io';
    return { url, path };
  } catch (error) {
    // baseURL is a path, but not a valid url
    const url = new URL(window.location.origin + baseURL);
    const path = url.pathname + 'socket.io';
    return { url: url.toString(), path };
  }
}

const { url, path } = getSocketURL(import.meta.env.VITE_API_BASE_URL);

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
      transports: ['websocket'],
    };
    const manager = new Manager(url, options);
    return manager.socket('/', {
      auth: {
        account: token,
      },
    });
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
