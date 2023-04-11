import { Socket } from 'socket.io-client';
import React from 'react';

type SocketContextType = {
  socket: Socket | null;
};

type SocketContextOutType = {
  socket: Socket;
};

const SocketContext = React.createContext<SocketContextType>({
  socket: null,
});

export const SocketContextProvider = SocketContext.Provider;

export function useSocketContext() {
  const c = React.useContext(SocketContext);
  if (!c.socket) {
    throw new Error('Please use SocketContextProvider');
  }
  return c as SocketContextOutType;
}
