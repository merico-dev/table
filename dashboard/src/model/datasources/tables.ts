import { types } from 'mobx-state-tree';

export type TableInfoType = {
  table_schema: string;
  table_name: string;
  table_type: string;
  engine: string;
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
      return `SELECT table_schema, table_name, table_type, engine FROM information_schema.tables WHERE table_type = 'BASE TABLE' ORDER BY table_name`;
    },
  }));
