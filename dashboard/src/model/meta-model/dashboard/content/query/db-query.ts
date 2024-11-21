import { getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { DataSourceType } from './types';

export const DBQueryMeta = types
  .model('DBQueryMeta', {
    sql: types.string,
  })
  .views((self) => ({
    get base() {
      return getParent(self);
    },
    get valid() {
      return !!self.sql;
    },
    get json() {
      const { sql } = self;
      return { sql };
    },
  }))
  .actions((self) => {
    return {
      setSQL(sql: string) {
        self.sql = sql;
      },
    };
  });
export type DBQueryMetaInstance = Instance<typeof DBQueryMeta>;
export type DBQueryMetaSnapshotIn = SnapshotIn<DBQueryMetaInstance>;
