import { useCreation } from 'ahooks';
import { InteractionManager } from '~/interactions/interaction-manager';
import { OPERATIONS } from '~/interactions/operation/operations';
import { IVizManager } from '~/components/plugins';
import { IVizInteractionManager, VizInstance } from '~/types/plugin';

export const useCurrentInteractionManager = ({
  vizManager,
  instance,
}: {
  vizManager: IVizManager;
  instance: VizInstance;
}): IVizInteractionManager => {
  return useCreation(
    () => new InteractionManager(instance, vizManager.resolveComponent(instance.type), OPERATIONS),
    [instance, vizManager],
  );
};
