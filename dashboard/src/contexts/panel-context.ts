import React from 'react';
import { PanelModelInstance } from '~/model/views/view/panels';

const PanelContext = React.createContext<{
  panel: PanelModelInstance | null;
  data: any;
  loading: boolean;
  error?: string;
}>({
  panel: null,
  data: [],
  loading: false,
});

export const PanelContextProvider = PanelContext.Provider;

export function usePanelContext() {
  const c = React.useContext(PanelContext);
  if (!c.panel) {
    throw new Error('Please use PanelContextProvider');
  }
  return c as {
    panel: PanelModelInstance;
    data: any;
    loading: boolean;
    error?: string;
  };
}
