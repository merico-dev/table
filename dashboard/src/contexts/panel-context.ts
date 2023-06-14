import React from 'react';
import { PanelModelInstance } from '~/model/panels';

const PanelContext = React.createContext<{
  panel: PanelModelInstance | null;
  data: Record<string, TVizData>;
  loading: boolean;
  errors: string[];
}>({
  panel: null,
  data: {},
  loading: false,
  errors: [],
});

export const PanelContextProvider = PanelContext.Provider;

export function usePanelContext() {
  const c = React.useContext(PanelContext);
  if (!c.panel) {
    throw new Error('Please use PanelContextProvider');
  }
  return c as {
    panel: PanelModelInstance;
    data: Record<string, TVizData>;
    loading: boolean;
    errors: string[];
  };
}
