import { Socket } from 'socket.io-client';
import React from 'react';

const SocketContext = React.createContext<{
  socket: Socket | null;
}>({
  socket: null,
});

export const SocketContextProvider = SocketContext.Provider;

export function useSocketContext() {
  const c = React.useContext(SocketContext);
  if (!c.socket) {
    throw new Error('Please use SocketContextProvider');
  }
  return c as {
    socket: Socket;
  };
}
