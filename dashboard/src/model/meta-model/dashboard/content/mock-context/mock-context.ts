import { types } from 'mobx-state-tree';
import { ContextRecordType } from '~/model';

export const MockContextMeta = types.model('MockContextMeta', {
  current: types.optional(types.frozen<ContextRecordType>(), {}),
});
