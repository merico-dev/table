import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { type IObservableArray } from 'mobx';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';
import { typeAssert } from '~/types/utils';

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

export interface IHTTPQueryMeta {
  // Properties
  _type: DataSourceType.HTTP;
  react_to: IObservableArray<string>;

  // Views
  readonly valid: boolean;
  readonly json: {
    react_to: IObservableArray<string>;
    _type: DataSourceType.HTTP;
  };

  // Actions
  setReactTo(v: string[]): void;
}

typeAssert.shouldExtends<IHTTPQueryMeta, HTTPQueryMetaInstance>();

export const createHTTPQueryConfig = () =>
  HTTPQueryMeta.create({
    _type: DataSourceType.HTTP,
    react_to: [],
  });
