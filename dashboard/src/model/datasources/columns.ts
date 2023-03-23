import { types } from 'mobx-state-tree';

export type ColumnInfoType = {
  column_name: string;
  column_type: string;
  is_nullable: string;
  column_default: string;
  column_comment: string;
  ordinal_position: string;
};

export const ColumnsModel = types
  .model({
    table_schema: types.optional(types.string, ''),
    table_name: types.optional(types.string, ''),
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
    get sql() {
      return `
        SELECT column_name, column_type, is_nullable, column_default, column_comment, ordinal_position
        FROM information_schema.columns
        WHERE table_name = '${self.table_name}' AND table_schema = '${self.table_schema}'
      `;
    },
  }))
  .actions((self) => ({
    setKeywords(table_schema: string, table_name: string) {
      self.table_schema = table_schema;
      self.table_name = table_name;
    },
  }));
