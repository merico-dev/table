import React from 'react';
import { AdditionalPanelMenuItem } from '~/types';

export interface IAdditionalPanelMenuItemsContext {
  items: AdditionalPanelMenuItem[];
}

const initialContext = {
  items: [],
};

export const AdditionalPanelMenuItemsContext = React.createContext<IAdditionalPanelMenuItemsContext>(initialContext);
export const AdditionalPanelMenuItemsContextProvider = AdditionalPanelMenuItemsContext.Provider;

export function useAdditionalPanelMenuItems() {
  return React.useContext(AdditionalPanelMenuItemsContext);
}
