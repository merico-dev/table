import React from 'react';

export interface ILayoutStateContext {
  inEditMode: boolean;
}

const initialContext = {
  inEditMode: false,
};

export const LayoutStateContext = React.createContext<ILayoutStateContext>(initialContext);

export function useLayoutStateContext() {
  const ctx = React.useContext(LayoutStateContext);
  if (!ctx) {
    throw new Error('Please use LayoutStateContext.Provider');
  }
  return ctx;
}
