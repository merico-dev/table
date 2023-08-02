import React from 'react';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { PanelRenderModelInstance } from '~/model';

const PanelContext = React.createContext<{
  panel: PanelModelInstance | PanelRenderModelInstance | null;
  data: TPanelData;
  loading: boolean;
  errors: string[];
}>({
  panel: null,
  data: {},
  loading: false,
  errors: [],
});

export const PanelContextProvider = PanelContext.Provider;

export function usePanelContext<T = PanelRenderModelInstance>() {
  const c = React.useContext(PanelContext);
  if (!c.panel) {
    throw new Error('Please use PanelContextProvider');
  }
  return c as {
    panel: T;
    data: TPanelData;
    loading: boolean;
    errors: string[];
  };
}

export const useRenderPanelContext = () => usePanelContext<PanelRenderModelInstance>();
export const useEditPanelContext = () => usePanelContext<PanelModelInstance>();
