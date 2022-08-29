import { cloneDeep } from 'lodash';
import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { DEFAULT_CONFIG } from './type';
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
  createConfig() {
    return {
      version: 1,
      config: cloneDeep(DEFAULT_CONFIG),
    };
  },
  displayName: 'Table',
  migrator: new VizTableMigrator(),
  name: 'table',
  viewRender: VizTable,
  configRender: VizTablePanel,
};
