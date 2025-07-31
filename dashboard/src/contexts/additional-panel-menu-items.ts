import React from 'react';
import { PanelMenuItem } from '~/types';

export interface IAdditionalPanelMenuItemsContext {
  items: PanelMenuItem[];
}

const initialContext = {
  items: [],
};

export const AdditionalPanelMenuItemsContext = React.createContext<IAdditionalPanelMenuItemsContext>(initialContext);
export const AdditionalPanelMenuItemsContextProvider = AdditionalPanelMenuItemsContext.Provider;

export function useAdditionalPanelMenuItems() {
  return React.useContext(AdditionalPanelMenuItemsContext);
}
