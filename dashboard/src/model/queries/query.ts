import { Instance, types } from 'mobx-state-tree';

export enum DataSourceType {
  Postgresql = 'postgresql',
  MySQL = 'mysql',
  HTTP = 'http',
}

export const QueryModel = types
  .model('QueryModel', {
    id: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.Postgresql, DataSourceType.MySQL, DataSourceType.HTTP]),
    key: types.string,
    sql: types.string,
  })
  .actions((self) => ({
    setKey(key: string) {
      self.key = key;
    },
    setType(type: DataSourceType) {
      self.type = type;
    },
    setSQL(sql: string) {
      self.sql = sql;
    },
  }));

export type QueryModelInstance = Instance<typeof QueryModel>;
