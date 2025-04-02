import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { typeAssert } from '~/types/utils';

export const SQLSnippetMeta = types
  .model('SQLSnippetMeta', {
    key: types.string,
    value: types.string,
  })
  .views((self) => ({
    get json() {
      const { key, value } = self;
      return {
        key,
        value,
      };
    },
  }))
  .actions((self) => ({
    setKey(key: string) {
      self.key = key;
    },
    setValue(value: string) {
      self.value = value;
    },
  }));

export type SQLSnippetMetaSnapshotIn = SnapshotIn<Instance<typeof SQLSnippetMeta>>;

export interface ISQLSnippetMeta {
  // Properties
  key: string;
  value: string;

  // Views
  readonly json: {
    key: string;
    value: string;
  };

  // Actions
  setKey(key: string): void;
  setValue(value: string): void;
}

typeAssert.shouldExtends<ISQLSnippetMeta, Instance<typeof SQLSnippetMeta>>();
