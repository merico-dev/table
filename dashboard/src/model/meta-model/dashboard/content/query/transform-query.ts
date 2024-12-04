import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';

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

export const createTransformQueryConfig = () =>
  TransformQueryMeta.create({
    _type: DataSourceType.Transform,
    dep_query_ids: [],
  });
