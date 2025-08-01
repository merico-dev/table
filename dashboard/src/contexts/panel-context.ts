import { EChartsOption } from 'echarts';
import React from 'react';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { PanelRenderModelInstance } from '~/model';

type PanelContextType<T> = {
  panel: T;
  data: TPanelData;
  loading: boolean;
  errors: string[];
  downloadPanelScreenshot: () => void;
  echartsOptions: EChartsOption | null;
  setEchartsOptions: (v: EChartsOption | null) => void;
};

const PanelContext = React.createContext<PanelContextType<PanelModelInstance | PanelRenderModelInstance | null>>({
  panel: null,
  data: {},
  loading: false,
  errors: [],
  downloadPanelScreenshot: () => {},
  echartsOptions: null,
  setEchartsOptions: () => {},
});

export const PanelContextProvider = PanelContext.Provider;

function usePanelContext<T = PanelRenderModelInstance>() {
  const c = React.useContext(PanelContext);
  if (!c.panel) {
    throw new Error('Please use PanelContextProvider');
  }
  return c as PanelContextType<T>;
}

export const useRenderPanelContext = () => usePanelContext<PanelRenderModelInstance>();
export const useEditPanelContext = () => usePanelContext<PanelModelInstance>();

function useIsInPanelContext<T = PanelRenderModelInstance>() {
  try {
    usePanelContext<T>();
    return true;
  } catch (error) {
    return false;
  }
}

export const useIsInRenderPanelContext = () => useIsInPanelContext<PanelRenderModelInstance>();
export const useIsInEditPanelContext = () => useIsInPanelContext<PanelModelInstance>();
