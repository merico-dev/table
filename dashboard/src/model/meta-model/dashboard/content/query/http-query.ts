import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';

export const HTTPQueryMeta = types
  .model('HTTPQueryMeta', {
    react_to: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get valid() {
      return true;
    },
    get json() {
      const { react_to } = self;
      return shallowToJS({ react_to });
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
