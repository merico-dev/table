import { getParent, types } from 'mobx-state-tree';
import { DataSourceType } from '../queries/types';

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
    get sql() {
      const payload: { type: DataSourceType; table_name: string; table_schema: string } = getParent(self, 1);
      const { type, table_name, table_schema } = payload;

      if (type === DataSourceType.MySQL) {
        return `
          SELECT ordinal_position, column_key, column_name, column_type, is_nullable, column_default, column_comment
          FROM information_schema.columns
          WHERE table_name = '${table_name}' AND table_schema = '${table_schema}'
        `;
      }
      if (type === DataSourceType.Postgresql) {
        const attrelid = `'${table_schema}.${table_name}'::regclass`;
        return `
          SELECT
            ordinal_position,
            UPPER(pc.contype) AS column_key,
            pg_get_constraintdef(pc.oid) AS column_key_text,
            column_name,
            format_type(atttypid, atttypmod) AS column_type,
            is_nullable,
            column_default,
            pg_catalog.col_description(${attrelid}, ordinal_position) AS column_comment
          FROM
            information_schema.columns
            JOIN pg_attribute pa ON pa.attrelid = ${attrelid}
              AND attname = column_name
            LEFT JOIN pg_constraint pc ON pc.conrelid = ${attrelid} AND ordinal_position = any(pc.conkey)
          WHERE
            table_name = '${table_name}' AND table_schema = '${table_schema}';
        `;
      }

      return '';
    },
  }));
