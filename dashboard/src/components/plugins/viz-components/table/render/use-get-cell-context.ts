import { Cell } from '@tanstack/react-table';
import { useCallback, useContext } from 'react';
import { ClickCellContent } from '~/components/plugins/viz-components/table/triggers/click-cell-content';
import { useCurrentInteractionManager } from '~/interactions/hooks/use-current-interaction-manager';
import { useTriggerSnapshotList } from '~/interactions/hooks/use-watch-triggers';
import { AnyObject } from '~/types';
import { VizInstance } from '~/types/plugin';
import { IVizManager, PluginContext } from '../../..';
import { TableCellContext } from '../table-cell-context';
import { TriggerConfigType } from '../type';

export const useGetCellContext = (context: {
  vizManager: IVizManager;
  instance: VizInstance;
  getColIndex: (cell: Cell<AnyObject, unknown>) => number;
}) => {
  const interactionManager = useCurrentInteractionManager(context);
  const triggers = useTriggerSnapshotList<TriggerConfigType>(interactionManager.triggerManager, ClickCellContent.id);
  const { colorManager } = useContext(PluginContext);
  return useCallback(
    (cell: Cell<AnyObject, unknown>) =>
      new TableCellContext(context.getColIndex, cell, triggers, interactionManager, colorManager),
    [triggers, interactionManager, context.getColIndex],
  );
};
