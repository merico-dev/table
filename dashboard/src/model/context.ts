import _ from 'lodash';
import { types } from 'mobx-state-tree';

export const ContextModel = types
  .model('ContextModel', {
    current: types.optional(types.frozen(), {}),
  })
  .views((self) => ({
    get keys() {
      return Object.keys(self.current);
    },
    get entries() {
      return Object.entries(self.current);
    },
  }))
  .actions((self) => {
    return {
      replace(record: Record<string, any>) {
        self.current = record;
      },
      get(key: string) {
        return self.current[key];
      },
      set(key: string, value: any) {
        self.current[key] = value;
      },
    };
  });

export type ContextInfoType = Record<string, any>;
