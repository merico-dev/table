import { types, type Instance } from 'mobx-state-tree';
import { ContextRecordType } from '~/model';
import { typeAssert } from '~/types/utils';

export const MockContextMeta = types
  .model('MockContextMeta', {
    current: types.optional(types.frozen<ContextRecordType>(), {}),
  })
  .views((self) => ({
    get keys() {
      return Object.keys(self.current);
    },
    get keySet() {
      return new Set(this.keys);
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

export interface IMockContextMeta {
  current: ContextRecordType;

  readonly keys: string[];
  readonly keySet: Set<string>;
  readonly entries: Array<[string, ContextRecordType]>;

  replace(record: ContextRecordType): void;
  defaults(record: ContextRecordType): void;
  get<T = any>(key: string): T;
  set<T = any>(key: string, value: T): void;
}

typeAssert.shouldExtends<Instance<typeof MockContextMeta>, IMockContextMeta>();
typeAssert.shouldExtends<IMockContextMeta, Instance<typeof MockContextMeta>>();
