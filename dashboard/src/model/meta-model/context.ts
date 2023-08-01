import { types } from 'mobx-state-tree';

export type ContextRecordValueType = any;
export type ContextRecordType = Record<string, ContextRecordValueType>;

export const ContextMeta = types.model('ContextMeta', {
  current: types.optional(types.frozen<ContextRecordType>(), {}),
});
