import { types } from 'mobx-state-tree';

export type ColumnInfoType = {
  column_key: string;
  column_key_text?: string;
  column_name: string;
  column_type: string;
  is_nullable: string;
  column_default: string;
  column_comment: string;
  ordinal_position: string;
};

export const ColumnsModel = types
  .model({
    data: types.optional(types.frozen<ColumnInfoType[]>(), []),
    state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
    error: types.frozen(),
  })
  .views((self) => ({
    get loading() {
      return self.state === 'loading';
    },
    get empty() {
      return self.data.length === 0;
    },
  }));
