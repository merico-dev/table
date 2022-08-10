import { VizComponent, VizComponentMigrationContext } from '../../../types/plugin';
import { VizTable } from './viz-table';

export const TableVizComponent: VizComponent = {
  configRender: () => null,
  displayName: 'Table',
  migration(ctx: VizComponentMigrationContext): Promise<void> {
    return Promise.resolve(undefined);
  },
  name: 'dashboard/table',
  viewRender: VizTable,
};
