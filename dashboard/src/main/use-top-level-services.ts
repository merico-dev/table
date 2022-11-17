import React from 'react';
import { IPluginContextProps, tokens } from '~/plugins';
import { IServiceLocator } from '~/service-locator';

export function useTopLevelServices(pluginContext: IPluginContextProps) {
  return React.useCallback((services: IServiceLocator) => {
    return services
      .provideValue(tokens.pluginManager, pluginContext.pluginManager)
      .provideValue(tokens.vizManager, pluginContext.vizManager)
      .provideValue(tokens.colorManager, pluginContext.colorManager);
  }, []);
}
