import { types } from 'mobx-state-tree';

export type MockContextRecordValueType = any;
export type MockContextRecordType = Record<string, MockContextRecordValueType>;

export const MockContextMeta = types.model('MockContextMeta', {
  current: types.optional(types.frozen<MockContextRecordType>(), {}),
});
