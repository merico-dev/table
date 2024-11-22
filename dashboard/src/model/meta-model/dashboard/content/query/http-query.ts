import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';

export const HTTPQueryMeta = types
  .model('HTTPQueryMeta', {
    _type: types.literal(DataSourceType.HTTP),
    react_to: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get valid() {
      return true;
    },
    get json() {
      const { react_to, _type } = self;
      return shallowToJS({ react_to, _type });
    },
  }))
  .actions((self) => ({
    setReactTo(v: string[]) {
      self.react_to.length = 0;
      self.react_to.push(...v);
    },
  }));
export type HTTPQueryMetaInstance = Instance<typeof HTTPQueryMeta>;
export type HTTPQueryMetaSnapshotIn = SnapshotIn<HTTPQueryMetaInstance>;

export const createHTTPQueryConfig = () =>
  HTTPQueryMeta.create({
    _type: DataSourceType.HTTP,
    react_to: [],
  });
