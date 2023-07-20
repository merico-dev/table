import React from 'react';
import { IPluginContextProps, tokens } from '~/components/plugins';
import { IServiceLocator } from '~/components/plugins/service/service-locator';

export function useTopLevelServices(pluginContext: IPluginContextProps) {
  return React.useCallback((services: IServiceLocator) => {
    return services
      .provideValue(tokens.pluginManager, pluginContext.pluginManager)
      .provideValue(tokens.vizManager, pluginContext.vizManager)
      .provideValue(tokens.colorManager, pluginContext.colorManager);
  }, []);
}
