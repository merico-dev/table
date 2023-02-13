import _ from 'lodash';
import React from 'react';

export interface IFullScreenPanelContext {
  fullScreenPanelID: string;
  setFullScreenPanelID: (v: string) => void;
}

const initialContext = {
  fullScreenPanelID: '',
  setFullScreenPanelID: _.noop,
};

export const FullScreenPanelContext = React.createContext<IFullScreenPanelContext>(initialContext);

export function useFullScreenPanelContext() {
  const ctx = React.useContext(FullScreenPanelContext);
  if (!ctx) {
    throw new Error('Please use FullScreenPanelContext.Provider');
  }
  return ctx;
}
