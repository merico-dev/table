import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { type IObservableArray } from 'mobx';
import { createDBQueryConfig, DBQueryMeta, type IDBQueryMeta } from './db-query';
import { HTTPQueryMeta, createHTTPQueryConfig, type IHTTPQueryMeta } from './http-query';
import { TransformQueryMeta, createTransformQueryConfig, type ITransformQueryMeta } from './transform-query';
import {
  MericoMetricQueryMeta,
  createMericoMetricQueryMetaConfig,
  type IMericoMetricQueryMeta,
} from './merico-metric-query';

import { DataSourceType } from './types';
import { shallowToJS } from '~/utils';
import { typeAssert } from '~/types/utils';

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
      switch (type) {
        case DataSourceType.HTTP:
          self.config = createHTTPQueryConfig();
          break;
        case DataSourceType.MySQL:
        case DataSourceType.Postgresql:
          self.config = createDBQueryConfig(type);
          break;
        case DataSourceType.Transform:
          self.config = createTransformQueryConfig();
          break;
        case DataSourceType.MericoMetricSystem:
          self.config = createMericoMetricQueryMetaConfig();
          break;
        default:
          throw new Error(`Unexpected query type[${type}]`);
      }
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

export interface IQueryMeta {
  // Properties
  id: string;
  name: string;
  key: string;
  type: DataSourceType;
  config: IDBQueryMeta | IHTTPQueryMeta | ITransformQueryMeta | IMericoMetricQueryMeta;
  pre_process: string;
  post_process: string;
  run_by: IObservableArray<string>;

  // Views
  readonly valid: boolean;
  readonly json: {
    id: string;
    name: string;
    key: string;
    type: DataSourceType;
    config: (IDBQueryMeta | IHTTPQueryMeta | ITransformQueryMeta | IMericoMetricQueryMeta)['json'];
    pre_process: string;
    post_process: string;
    run_by: IObservableArray<string>;
  };

  // Actions
  setName(name: string): void;
  setKey(key: string): void;
  setType(type: DataSourceType): void;
  setRunBy(v: string[]): void;
  setPreProcess(v: string): void;
  setPostProcess(v: string): void;
}

typeAssert.shouldExtends<IQueryMeta, QueryMetaInstance>();
typeAssert.shouldExtends<QueryMetaInstance, IQueryMeta>();
