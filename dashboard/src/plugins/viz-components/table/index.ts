import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizTable } from './viz-table';
import { VizTablePanel } from './viz-table-panel';

class VizTableMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
  }
}

export const TableVizComponent: VizComponent = {
  displayName: 'Table',
  migrator: new VizTableMigrator(),
  name: 'table',
  viewRender: VizTable,
  configRender: VizTablePanel,
};
