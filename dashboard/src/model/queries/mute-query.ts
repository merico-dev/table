import { Instance, types } from 'mobx-state-tree';
import { DataSourceType } from './types';

export const MuteQueryModel = types
  .model('QueryModel', {
    id: types.string,
    name: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.Postgresql, DataSourceType.MySQL, DataSourceType.HTTP]),
    key: types.string,
    sql: types.string,
  })
  .views((self) => ({
    get valid() {
      return self.id && self.type && self.key && self.sql && self.name;
    },
    get json() {
      const { id, name, type, key, sql } = self;
      return { id, name, type, key, sql };
    },
  }));

export type MuteQueryModelInstance = Instance<typeof MuteQueryModel>;
