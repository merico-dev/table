import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';
import { typeAssert } from '~/types/utils';
import type { IObservableArray } from 'mobx';

export const TransformQueryMeta = types
  .model('TransformQueryMeta', {
    _type: types.literal(DataSourceType.Transform),
    dep_query_ids: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get valid() {
      return self.dep_query_ids.length > 0;
    },
    get json() {
      const { dep_query_ids, _type } = self;
      return shallowToJS({ dep_query_ids, _type });
    },
  }))
  .actions((self) => ({
    setDependantQueryIDs(v: string[]) {
      self.dep_query_ids.length = 0;
      self.dep_query_ids.push(...v);
    },
  }));
export type TransformQueryMetaInstance = Instance<typeof TransformQueryMeta>;
export type TransformQueryMetaSnapshotIn = SnapshotIn<TransformQueryMetaInstance>;

export interface ITransformQueryMeta {
  // Properties
  _type: DataSourceType.Transform;
  dep_query_ids: IObservableArray<string>;

  // Views
  readonly valid: boolean;
  readonly json: {
    dep_query_ids: IObservableArray<string>;
    _type: DataSourceType.Transform;
  };

  // Actions
  setDependantQueryIDs(v: string[]): void;
}

typeAssert.shouldExtends<ITransformQueryMeta, TransformQueryMetaInstance>();
typeAssert.shouldExtends<TransformQueryMetaInstance, ITransformQueryMeta>();

export const createTransformQueryConfig = () =>
  TransformQueryMeta.create({
    _type: DataSourceType.Transform,
    dep_query_ids: [],
  });
