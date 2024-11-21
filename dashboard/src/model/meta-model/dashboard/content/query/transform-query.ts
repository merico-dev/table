import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';

export const TransformQueryMeta = types
  .model('TransformQueryMeta', {
    dep_query_ids: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get valid() {
      return self.dep_query_ids.length > 0;
    },
    get json() {
      const { dep_query_ids } = self;
      return shallowToJS({ dep_query_ids });
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
