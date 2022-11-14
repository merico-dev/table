import { useCallback } from 'react';
import { InteractionManager, OPERATIONS } from '~/interactions';
import { IPanelInfo, tokens } from '~/plugins';
import { InstanceMigrator } from '~/plugins/instance-migrator';
import { IServiceLocator } from '~/service-locator';

export function useConfigVizInstanceService(panel: IPanelInfo) {
  return useCallback(
    (services: IServiceLocator) => {
      const vizManager = services.getRequired(tokens.vizManager);
      const component = vizManager.resolveComponent(panel.viz.type);
      return services
        .createScoped()
        .provideFactory(tokens.instanceScope.vizInstance, () => vizManager.getOrCreateInstance(panel))
        .provideFactory(tokens.instanceScope.interactionManager, (services) => {
          const instance = services.getRequired(tokens.instanceScope.vizInstance);
          return new InteractionManager(instance, component, OPERATIONS);
        })
        .provideFactory(tokens.instanceScope.operationManager, (services) => {
          // todo: create operation manager with instance
          return services.getRequired(tokens.instanceScope.interactionManager).operationManager;
        })
        .provideFactory(tokens.instanceScope.triggerManager, (services) => {
          return services.getRequired(tokens.instanceScope.interactionManager).triggerManager;
        })
        .provideFactory(tokens.instanceScope.migrator, (services) => new InstanceMigrator(services));
    },
    [panel.viz.type, panel.viz.conf],
  );
}
