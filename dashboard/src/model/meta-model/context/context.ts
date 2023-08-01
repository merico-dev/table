import { types } from 'mobx-state-tree';

export type ContextRecordValueType = any;
export type ContextRecordType = Record<string, ContextRecordValueType>;

export const ContextMeta = types
  .model('ContextMeta', {
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
      set(key: string, value: $TSFixMe) {
        self.current[key] = value;
      },
    };
  });
