import { Instance, types } from 'mobx-state-tree';
import { DataSourceType } from './types';

export const MuteQueryModel = types
  .model('QueryModel', {
    id: types.identifier,
    type: types.enumeration('DataSourceType', [DataSourceType.Postgresql, DataSourceType.MySQL, DataSourceType.HTTP]),
    key: types.string,
    sql: types.string,
  })
  .views((self) => ({
    get valid() {
      return self.id && self.type && self.key && self.sql;
    },
    get configurations() {
      const { id, type, key, sql } = self;
      return { id, type, key, sql };
    },
  }));

export type MuteQueryModelInstance = Instance<typeof MuteQueryModel>;
