import { getParent, types } from 'mobx-state-tree';
import { DataSourceType } from '../queries/types';

export type MYSQLIndexInfoType = {
  index_length: string;
  index_name: string;
  index_algorithm: string;
  is_unique: boolean;
  column_name: string;
};

export type PGIndexInfoType = {
  index_name: string;
  index_algorithm: string;
  is_unique: boolean;
  index_definition: string;
  condition: string;
  comment: string;
};

export type IndexInfoType = PGIndexInfoType | MYSQLIndexInfoType;

export const IndexesModel = types
  .model({
    table_schema: types.optional(types.string, ''), // TODO: hoist
    table_name: types.optional(types.string, ''), // TODO: hoist
    data: types.optional(types.frozen<IndexInfoType[]>(), []),
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
          SELECT
            sub_part AS index_length,
            index_name AS index_name,
            index_type AS index_algorithm,
            CASE non_unique WHEN 0 THEN 'TRUE' ELSE 'FALSE' END AS is_unique,
            column_name AS column_name
          FROM
            information_schema.statistics
          WHERE
            table_name = '${self.table_name}' AND table_schema = '${self.table_schema}'
          ORDER BY
            seq_in_index ASC;
        `;
      }
      if (type === DataSourceType.Postgresql) {
        return `
          SELECT
            ix.relname AS index_name,
            upper(am.amname) AS index_algorithm,
            indisunique AS is_unique,
            pg_get_indexdef(indexrelid) AS index_definition,
            CASE WHEN position(' WHERE ' IN pg_get_indexdef(indexrelid)) > 0 THEN
              regexp_replace(pg_get_indexdef(indexrelid), '.+WHERE ', '')
            WHEN position(' WITH ' IN pg_get_indexdef(indexrelid)) > 0 THEN
              regexp_replace(pg_get_indexdef(indexrelid), '.+WITH ', '')
            ELSE
              ''
            END AS condition,
            pg_catalog.obj_description(i.indexrelid, 'pg_class') AS comment
          FROM
            pg_index i
            JOIN pg_class t ON t.oid = i.indrelid
            JOIN pg_class ix ON ix.oid = i.indexrelid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            JOIN pg_am AS am ON ix.relam = am.oid
          WHERE
            t.relname = '${self.table_name}' AND n.nspname = '${self.table_schema}';
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
