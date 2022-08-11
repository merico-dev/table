import { Instance, types } from 'mobx-state-tree';

export const SQLSnippetModel = types
  .model('SQLSnippetModel', {
    key: types.string,
    value: types.string,
  })
  .actions((self) => ({
    setKey(key: string) {
      self.key = key;
    },
    setValue(value: string) {
      self.value = value;
    },
  }));

export type SQLSnippetModelInstance = Instance<typeof SQLSnippetModel>;
