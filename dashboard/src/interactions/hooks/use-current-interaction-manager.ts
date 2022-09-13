import { useCreation } from 'ahooks';
import { useContext } from 'react';
import { InteractionManager } from '~/interactions/interaction-manager';
import { OPERATIONS } from '~/interactions/operation/operations';
import { PluginContext } from '~/plugins';
import { useCurrentVizInstance } from '~/plugins/hooks/use-current-viz-instance';
import { IVizInteractionManager } from '~/types/plugin';

export const useCurrentInteractionManager = (): IVizInteractionManager => {
  const { vizManager } = useContext(PluginContext);
  const instance = useCurrentVizInstance();
  return useCreation(
    () => new InteractionManager(instance, vizManager.resolveComponent(instance.type), OPERATIONS),
    [instance],
  );
};
