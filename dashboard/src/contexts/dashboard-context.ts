import React from 'react';
import { DashboardModelInstance } from '../dashboard-editor/model';
import { DashboardRenderModelInstance } from '~/dashboard-render/model/dashboard';

const DashboardModelContext = React.createContext<DashboardModelInstance | DashboardRenderModelInstance | null>(null);

export const DashboardModelContextProvider = DashboardModelContext.Provider;

export function useDashboardContext<T = DashboardModelInstance>() {
  const model = React.useContext(DashboardModelContext);
  if (!model) {
    throw new Error('Please use DashboardModelContextProvider');
  }
  return model as T;
}

export const useEditDashboardContext = () => useDashboardContext<DashboardModelInstance>();
export const useRenderDashboardContext = () => useDashboardContext<DashboardRenderModelInstance>();
