import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';

export const QueryMeta = types
  .model('QueryMeta', {
    id: types.string,
    name: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.Postgresql, DataSourceType.MySQL, DataSourceType.HTTP]),
    key: types.string,
    sql: types.string,
    pre_process: types.optional(types.string, ''),
    post_process: types.optional(types.string, ''),
    run_by: types.optional(types.array(types.string), []),
    react_to: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get valid() {
      const infoValid = self.id && self.type && self.key && self.name;
      if (!infoValid) {
        return false;
      }
      if (self.type === DataSourceType.HTTP) {
        return !!self.pre_process;
      }
      return !!self.sql;
    },
    get json() {
      const { id, name, type, key, sql, run_by, react_to, pre_process, post_process } = self;
      return shallowToJS({ id, key, sql, name, type, run_by, react_to, pre_process, post_process });
    },
  }))
  .actions((self) => {
    return {
      setName(name: string) {
        self.name = name;
      },
      setKey(key: string) {
        self.key = key;
      },
      setType(type: DataSourceType) {
        self.type = type;
      },
      setSQL(sql: string) {
        self.sql = sql;
      },
      setRunBy(v: string[]) {
        self.run_by.length = 0;
        self.run_by.push(...v);
      },
      setReactTo(v: string[]) {
        self.react_to.length = 0;
        self.react_to.push(...v);
      },
      setPreProcess(v: string) {
        self.pre_process = v;
      },
      setPostProcess(v: string) {
        self.post_process = v;
      },
    };
  });
export type QueryMetaInstance = Instance<typeof QueryMeta>;
export type QueryMetaSnapshotIn = SnapshotIn<QueryMetaInstance>;
