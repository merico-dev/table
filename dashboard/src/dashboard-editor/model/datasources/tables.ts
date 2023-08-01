import { getParent, types } from 'mobx-state-tree';
import { DataSourceType } from '~/model';

export type TableInfoType = {
  table_schema: string;
  table_name: string;
  table_type: 'VIEW' | 'BASE TABLE';
};

export type TableInfoTreeType = Record<string, TableInfoType[]>;

export const TablesModel = types
  .model({
    data: types.optional(types.frozen<TableInfoTreeType>(), {}),
    state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
    error: types.frozen(),
  })
  .views((self) => ({
    get loading() {
      return self.state === 'loading';
    },
    get empty() {
      return Object.keys(self.data).length === 0;
    },
    get sql() {
      // @ts-expect-error type of getParent
      const type: DataSourceType = getParent(self, 1).type;
      if (type === DataSourceType.MySQL) {
        return `SELECT table_schema, table_name, table_type FROM information_schema.tables ORDER BY table_schema, table_name`;
      }
      if (type === DataSourceType.Postgresql) {
        return `SELECT table_schema, table_name, table_type FROM information_schema.tables ORDER BY table_schema, table_name`;
      }
      return '';
    },
  }));
