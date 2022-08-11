import React from 'react';
import { createEmptyDashboardModel, DashboardModelInstance } from '../model';

export interface IModelContext {
  model: DashboardModelInstance;
}

const initialContext = {
  model: createEmptyDashboardModel(),
};

export const ModelContext = React.createContext<IModelContext>(initialContext);
