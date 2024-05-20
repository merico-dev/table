import { cloneDeep } from 'lodash';
import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { DEFAULT_CONFIG, ITableConf } from './type';
import { VizTable } from './render';
import { VizTableEditor } from './viz-table-editor';
import { ClickCellContent } from './triggers';
import { randomId } from '@mantine/hooks';
import { translation } from './translation';
import * as Migrators from './migrators';

class VizTableMigrator extends VersionBasedMigrator {
  readonly VERSION = 7;

  configVersions(): void {
    // @ts-expect-error data's type
    this.version(1, (data: Record<string, unknown>) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      const { columns, ...rest } = data.config as ITableConf;
      return {
        ...data,
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
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: Migrators.v3(data.config),
      };
    });
    this.version(4, (data, env) => {
      return {
        ...data,
        version: 4,
        config: Migrators.v4(data.config, env),
      };
    });
    this.version(5, (data) => {
      return {
        ...data,
        version: 5,
        config: Migrators.v5(data.config),
      };
    });
    this.version(6, (data) => {
      return {
        ...data,
        version: 6,
        config: Migrators.v6(data.config),
      };
    });
    this.version(7, (data) => {
      return {
        ...data,
        version: 7,
        config: Migrators.v7(data.config),
      };
    });
  }
}

export const TableVizComponent: VizComponent = {
  createConfig() {
    return {
      version: 7,
      config: cloneDeep(DEFAULT_CONFIG) as ITableConf,
    };
  },
  displayName: 'viz.table.viz_name',
  displayGroup: 'chart.groups.others',
  migrator: new VizTableMigrator(),
  name: 'table',
  viewRender: VizTable,
  configRender: VizTableEditor,
  triggers: [ClickCellContent],
  translation,
};
