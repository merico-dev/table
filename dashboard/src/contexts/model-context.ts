import React from 'react';
import { DashboardModelInstance } from '../dashboard-editor/model';

const ModelContext = React.createContext<DashboardModelInstance | null>(null);

export const ModelContextProvider = ModelContext.Provider;

export function useModelContext() {
  const model = React.useContext(ModelContext);
  if (!model) {
    throw new Error('Please use ModelContextProvider');
  }
  return model;
}
