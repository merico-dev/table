import _ from 'lodash';
import React from 'react';
import { DashboardMode } from '../types/dashboard';

export interface ILayoutStateContext {
  layoutFrozen: boolean;
  freezeLayout: React.Dispatch<React.SetStateAction<boolean>>;
  mode: DashboardMode;
  inEditMode: boolean;
  inUseMode: boolean;
}

const initialContext = {
  layoutFrozen: false,
  freezeLayout: _.noop,
  mode: DashboardMode.Edit,
  inEditMode: false,
  inUseMode: true,
};

export const LayoutStateContext = React.createContext<ILayoutStateContext>(initialContext);
