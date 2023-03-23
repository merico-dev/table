import { getParent, types } from 'mobx-state-tree';
import { DataSourceType } from '../queries/types';

export type ColumnInfoType = {
  column_key: string;
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
      // @ts-expect-error type of getParent
      const type: DataSourceType = getParent(self, 1).type;
      if (type === DataSourceType.MySQL) {
        return `
          SELECT ordinal_position, column_key, column_name, column_type, is_nullable, column_default, column_comment
          FROM information_schema.columns
          WHERE table_name = '${self.table_name}' AND table_schema = '${self.table_schema}'
        `;
      }
      if (type === DataSourceType.Postgresql) {
        const attrelid = `'${self.table_schema}.${self.table_name}'::regclass`;
        return `
          SELECT
            ordinal_position,
            column_name,
            format_type(atttypid, atttypmod) AS column_type,
            is_nullable,
            column_default,
            pg_catalog.col_description(${attrelid}, ordinal_position) AS column_comment
          FROM
            information_schema.columns
            JOIN pg_attribute pa ON pa.attrelid = ${attrelid}::regclass
              AND attname = column_name
          WHERE
            table_name = '${self.table_name}' AND table_schema = '${self.table_schema}';
        `;
      }

      return '';
    },
  }))
  .actions((self) => ({
    setKeywords(table_schema: string, table_name: string) {
      self.table_schema = table_schema;
      self.table_name = table_name;
    },
  }));
