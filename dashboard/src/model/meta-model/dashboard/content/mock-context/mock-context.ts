import { types } from 'mobx-state-tree';
import { ContextRecordType } from '~/model';

export const MockContextMeta = types
  .model('MockContextMeta', {
    current: types.optional(types.frozen<ContextRecordType>(), {}),
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
      replace(record: ContextRecordType) {
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
