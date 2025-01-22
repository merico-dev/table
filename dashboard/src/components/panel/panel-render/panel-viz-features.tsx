import React from 'react';
import { defaults } from 'lodash';

export interface IPanelVizFeatures {
  withInteraction: boolean;
  /**
   * Render panel title
   * @default true
   */
  withPanelTitle: boolean;
  /**
   * Render panel addon from plugins
   * @default true
   */
  withAddon: boolean;
}

const defaultValue = {
  withInteraction: true,
  withAddon: true,
  withPanelTitle: true,
};
const PanelVizFeaturesContext = React.createContext<IPanelVizFeatures>(defaultValue);

export interface IPanelVizFeaturesProps extends Partial<IPanelVizFeatures> {
  children: React.ReactNode;
}

export function PanelVizFeatures({ children, ...rest }: IPanelVizFeaturesProps) {
  const value = defaults({}, rest, defaultValue);
  return <PanelVizFeaturesContext.Provider value={value}>{children}</PanelVizFeaturesContext.Provider>;
}

export function usePanelVizFeatures(): IPanelVizFeatures {
  return React.useContext(PanelVizFeaturesContext);
}
