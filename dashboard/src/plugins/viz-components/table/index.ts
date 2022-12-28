import { cloneDeep } from 'lodash';
import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { DEFAULT_CONFIG, ITableConf } from './type';
import { VizTable } from './viz-table';
import { VizTablePanel } from './viz-table-panel';
import { ClickCellContent } from './triggers';
import { randomId } from '@mantine/hooks';

class VizTableMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: Record<string, unknown>) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data: ITableConf) => {
      const { columns, ...rest } = data;
      return {
        version: 2,
        config: {
          ...rest,
          columns: columns.map(({ id, ...restColumn }) => ({
            id: id ?? randomId(),
            ...restColumn,
          })),
        },
      };
    });
  }
}

export const TableVizComponent: VizComponent = {
  createConfig() {
    return {
      version: 2,
      config: cloneDeep(DEFAULT_CONFIG),
    };
  },
  displayName: 'Table',
  migrator: new VizTableMigrator(),
  name: 'table',
  viewRender: VizTable,
  configRender: VizTablePanel,
  triggers: [ClickCellContent],
};
