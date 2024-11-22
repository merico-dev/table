import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { DBQueryMeta } from './db-query';
import { HTTPQueryMeta } from './http-query';
import { TransformQueryMeta } from './transform-query';
import { MericoMetricQueryMeta } from './merico-metric-query';

import { DataSourceType } from './types';
import { shallowToJS } from '~/utils';

export const QueryMeta = types
  .model('QueryMeta', {
    id: types.string,
    name: types.string,
    key: types.string,
    type: types.enumeration('DataSourceType', [
      DataSourceType.Postgresql,
      DataSourceType.MySQL,
      DataSourceType.HTTP,
      DataSourceType.Transform,
      DataSourceType.MericoMetricSystem,
    ]),
    config: types.union(DBQueryMeta, HTTPQueryMeta, TransformQueryMeta, MericoMetricQueryMeta),
    pre_process: types.optional(types.string, ''),
    post_process: types.optional(types.string, ''),
    run_by: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get valid() {
      const { id, name, key, type, config } = self;
      return config.valid && !!id && !!name && !!key && !!type;
    },
    get json() {
      const { id, name, key, type, config, pre_process, post_process, run_by } = self;
      return shallowToJS({ id, name, key, type, config: config.json, pre_process, post_process, run_by });
    },
  }))
  .actions((self) => ({
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
  }));

export type QueryMetaInstance = Instance<typeof QueryMeta>;
export type QueryMetaSnapshotIn = SnapshotIn<QueryMetaInstance>;
