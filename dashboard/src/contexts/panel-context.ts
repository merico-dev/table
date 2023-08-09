import React from 'react';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { PanelRenderModelInstance } from '~/model';

const PanelContext = React.createContext<{
  panel: PanelModelInstance | PanelRenderModelInstance | null;
  data: TPanelData;
  loading: boolean;
  errors: string[];
  downloadPanelScreenshot: () => void;
}>({
  panel: null,
  data: {},
  loading: false,
  errors: [],
  downloadPanelScreenshot: () => {},
});

export const PanelContextProvider = PanelContext.Provider;

function usePanelContext<T = PanelRenderModelInstance>() {
  const c = React.useContext(PanelContext);
  if (!c.panel) {
    throw new Error('Please use PanelContextProvider');
  }
  return c as {
    panel: T;
    data: TPanelData;
    loading: boolean;
    errors: string[];
    downloadPanelScreenshot: () => {};
  };
}

export const useRenderPanelContext = () => usePanelContext<PanelRenderModelInstance>();
export const useEditPanelContext = () => usePanelContext<PanelModelInstance>();
