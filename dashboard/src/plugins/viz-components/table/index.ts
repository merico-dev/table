import { cloneDeep } from 'lodash';
import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { DEFAULT_CONFIG, ITableConf } from './type';
import { VizTable } from './viz-table';
import { VizTableEditor } from './viz-table-editor';
import { ClickCellContent } from './triggers';
import { randomId } from '@mantine/hooks';

function v3(prev: any): ITableConf {
  const { columns, ...rest } = prev;
  return {
    ...prev,
    columns: columns.map((c: any) => ({
      ...c,
      align: c.align ?? 'left',
    })),
  };
}

function v4(legacyConf: any, { panelModel }: IMigrationEnv): ITableConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { id_field, columns, ...rest } = legacyConf;
    return {
      ...rest,
      id_field: changeKey(id_field),

      columns: columns.map((c: any) => ({
        ...c,
        value_field: changeKey(c.value_field),
      })),
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

function v5(prev: any): ITableConf {
  const { columns, ...rest } = prev;
  return {
    ...rest,
    columns: columns.map((c: any) => ({
      ...c,
      align: c.align ?? 'left',
      cellBackgroundColor: c.cellBackgroundColor ?? '',
      width: c.width ?? '',
    })),
  };
}

class VizTableMigrator extends VersionBasedMigrator {
  readonly VERSION = 5;

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
        config: v3(data.config),
      };
    });
    this.version(4, (data, env) => {
      return {
        ...data,
        version: 4,
        config: v4(data.config, env),
      };
    });
    this.version(5, (data) => {
      return {
        ...data,
        version: 5,
        config: v5(data.config),
      };
    });
  }
}

export const TableVizComponent: VizComponent = {
  createConfig() {
    return {
      version: 5,
      config: cloneDeep(DEFAULT_CONFIG) as ITableConf,
    };
  },
  displayName: 'Table',
  displayGroup: 'Others',
  migrator: new VizTableMigrator(),
  name: 'table',
  viewRender: VizTable,
  configRender: VizTableEditor,
  triggers: [ClickCellContent],
};
