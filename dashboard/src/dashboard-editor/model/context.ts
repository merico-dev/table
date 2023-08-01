import { ContextMeta, ContextRecordType } from '~/model';

export const ContextModel = ContextMeta.views((self) => ({
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
    set(key: string, value: $TSFixMe) {
      self.current[key] = value;
    },
  };
});
