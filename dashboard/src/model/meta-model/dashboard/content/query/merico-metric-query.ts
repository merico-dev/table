import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';

export const MericoMetricQueryMeta = types
  .model('MericoMetricQueryMeta', {
    id: types.string,
    name: types.string,
    type: DataSourceType.MericoMetricSystem,
    key: types.string,
    pre_process: types.optional(types.string, ''),
    post_process: types.optional(types.string, ''),
    run_by: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get valid() {
      const infoValid = self.id && self.type && self.key && self.name;
      if (!infoValid) {
        return false;
      }
      // TODO: MMQ
      return true;
    },
    get json() {
      const { id, name, type, key, run_by, pre_process, post_process } = self;
      return shallowToJS({ id, key, name, type, run_by, pre_process, post_process });
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
      setRunBy(v: string[]) {
        self.run_by.length = 0;
        self.run_by.push(...v);
      },
      setPreProcess(v: string) {
        self.pre_process = v;
      },
      setPostProcess(v: string) {
        self.post_process = v;
      },
    };
  });
export type MericoMetricQueryMetaInstance = Instance<typeof MericoMetricQueryMeta>;
export type MericoMetricQueryMetaSnapshotIn = SnapshotIn<MericoMetricQueryMetaInstance>;
