import { ButtonProps } from '@mantine/core';
import React from 'react';

const DashboardThemeContext = React.createContext<{
  searchButtonProps: ButtonProps;
}>({
  searchButtonProps: {},
});

export const DashboardThemeContextProvider = DashboardThemeContext.Provider;

export function useDashboardThemeContext() {
  return React.useContext(DashboardThemeContext);
}
