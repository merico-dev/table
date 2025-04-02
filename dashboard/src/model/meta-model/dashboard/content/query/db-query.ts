import { getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { DataSourceType } from './types';
import { typeAssert } from '~/types/utils';

export const DBQueryMeta = types
  .model('DBQueryMeta', {
    _type: types.enumeration<DataSourceType.MySQL | DataSourceType.Postgresql>([
      DataSourceType.MySQL,
      DataSourceType.Postgresql,
    ]),
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
      const { sql, _type } = self;
      return { sql, _type };
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

export interface IDBQueryMeta {
  // Properties
  _type: DataSourceType.MySQL | DataSourceType.Postgresql;
  sql: string;

  // Views
  // todo: fix root type
  readonly base: any;
  readonly valid: boolean;
  readonly json: {
    sql: string;
    _type: DataSourceType.MySQL | DataSourceType.Postgresql;
  };

  // Actions
  setSQL(sql: string): void;
}

typeAssert.shouldExtends<IDBQueryMeta, DBQueryMetaInstance>();
typeAssert.shouldExtends<DBQueryMetaInstance, IDBQueryMeta>();

export const createDBQueryConfig = (type: DataSourceType.MySQL | DataSourceType.Postgresql) =>
  DBQueryMeta.create({
    _type: type,
    sql: '',
  });
