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
      defaults(record: ContextRecordType) {
        self.current = {
          ...record,
          ...self.current,
        };
      },
      get(key: string) {
        return self.current[key];
      },
      set(key: string, value: any) {
        self.current[key] = value;
      },
    };
  });

export function getInitialMockContextMeta(context: ContextRecordType) {
  return { current: context };
}
