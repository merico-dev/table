import { VizComponent, VizComponentMigrationContext } from '../../../types/plugin';
import { VizTable } from './viz-table';
import { VizTablePanel } from './viz-table-panel';

export const TableVizComponent: VizComponent = {
  displayName: 'Table',
  migration(ctx: VizComponentMigrationContext): Promise<void> {
    return Promise.resolve(undefined);
  },
  name: 'table',
  viewRender: VizTable,
  configRender: VizTablePanel,
};
