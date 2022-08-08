import React from 'react';
import { DashboardMode } from '../types/dashboard';

export interface ILayoutStateContext {
  layoutFrozen: boolean;
  freezeLayout: React.Dispatch<React.SetStateAction<boolean>>;
  mode: DashboardMode;
  inEditMode: boolean;
  inLayoutMode: boolean;
  inUseMode: boolean;
}

const initialContext = {
  layoutFrozen: false,
  freezeLayout: () => {},
  mode: DashboardMode.Edit,
  inEditMode: false,
  inLayoutMode: false,
  inUseMode: true,
};

export const LayoutStateContext = React.createContext<ILayoutStateContext>(initialContext);
