import _ from 'lodash';
import React from 'react';

export interface ILayoutStateContext {
  layoutFrozen: boolean;
  freezeLayout: React.Dispatch<React.SetStateAction<boolean>>;
  inEditMode: boolean;
  inUseMode: boolean;
}

const initialContext = {
  layoutFrozen: false,
  freezeLayout: _.noop,
  inEditMode: false,
  inUseMode: true,
};

export const LayoutStateContext = React.createContext<ILayoutStateContext>(initialContext);
