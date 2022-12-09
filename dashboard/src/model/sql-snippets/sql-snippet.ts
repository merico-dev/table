import { getParent, Instance, types } from 'mobx-state-tree';
import { SQLSnippetsModelInstance } from './types';

export const SQLSnippetModel = types
  .model('SQLSnippetModel', {
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
    isADuplicatedKey(newKey: string) {
      if (!newKey) {
        return false;
      }
      if (newKey === self.key) {
        return false;
      }
      const parent = getParent<SQLSnippetsModelInstance>(self, 2);
      const match = parent.findByKey(newKey);
      if (match) {
        return true;
      }
      return false;
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

export type SQLSnippetModelInstance = Instance<typeof SQLSnippetModel>;
