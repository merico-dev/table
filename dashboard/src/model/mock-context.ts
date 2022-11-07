import { types } from 'mobx-state-tree';

export const MockContextModel = types
  .model('MockContextModel', {
    original: types.optional(types.frozen(), {}),
    current: types.optional(types.frozen(), {}),
  })
  .views((self) => ({
    get keys() {
      return Object.keys(self.current);
    },
    get entries() {
      return Object.entries(self.current);
    },
    get changed() {
      return JSON.stringify(self.original) !== JSON.stringify(self.current);
    },
  }))
  .actions((self) => {
    return {
      replace(record: Record<string, $TSFixMe>) {
        self.current = record;
      },
      get(key: string) {
        return self.current[key];
      },
      set(key: string, value: $TSFixMe) {
        self.current[key] = value;
      },
      reset() {
        self.current = self.original;
      },
    };
  });

export type MockContextInfoType = Record<string, $TSFixMe>;
