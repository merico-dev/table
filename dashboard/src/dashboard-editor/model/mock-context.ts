import { ContextRecordType, MockContextMeta } from '~/model';

export const MockContextModel = MockContextMeta.views((self) => ({
  get keys() {
    return Object.keys(self.current);
  },
  get entries() {
    return Object.entries(self.current);
  },
})).actions((self) => {
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
