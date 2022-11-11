import { useCallback } from 'react';
import { InteractionManager, OPERATIONS } from '~/interactions';
import { IPanelInfo, tokens } from '~/plugins';
import { IServiceLocator } from '~/service-locator';

export function useConfigVizInstanceService(panel: IPanelInfo) {
  return useCallback(
    (services: IServiceLocator) => {
      const vizManager = services.getRequired(tokens.vizManager);
      const component = vizManager.resolveComponent(panel.viz.type);
      return services
        .createScoped()
        .provideFactory(tokens.instanceScope.vizInstance, () => vizManager.getOrCreateInstance(panel))
        .provideFactory(tokens.interactionManager, (services) => {
          const instance = services.getRequired(tokens.instanceScope.vizInstance);
          return new InteractionManager(instance, component, OPERATIONS);
        });
    },
    [panel.viz.type, panel.viz.conf],
  );
}
