import { types } from 'mobx-state-tree';

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
