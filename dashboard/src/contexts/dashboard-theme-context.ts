import React, { ReactNode } from 'react';
import { RenderSearchButtonProps } from '..';

const DashboardThemeContext = React.createContext<{
  renderSearchButton?: (props: RenderSearchButtonProps) => ReactNode;
}>({});

export const DashboardThemeContextProvider = DashboardThemeContext.Provider;

export function useDashboardThemeContext() {
  return React.useContext(DashboardThemeContext);
}
