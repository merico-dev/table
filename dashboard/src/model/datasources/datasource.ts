import axios from 'axios';
import _ from 'lodash';
import { reaction } from 'mobx';
import { getRoot, addDisposer, flow, Instance, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { TDataSourceConfig } from '~/api-caller/types';
import { DataSourceType } from '../queries/types';
import { ColumnsModel } from './columns';
import { IndexesModel } from './indexes';
import { TableInfoType, TablesModel } from './tables';
import { TableDataModel } from './table-data';

export const DataSourceModel = types
  .model('DataSourceModel', {
    id: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.HTTP, DataSourceType.MySQL, DataSourceType.Postgresql]),
    key: types.string,
    config: types.frozen<TDataSourceConfig>(),
    tables: types.optional(TablesModel, {}),
    columns: types.optional(ColumnsModel, {}),
    tableData: types.optional(TableDataModel, {}),
    indexes: types.optional(IndexesModel, {}),
    table_schema: types.optional(types.string, ''),
    table_name: types.optional(types.string, ''),
  })
  .views((self) => ({
    get content_id() {
      // @ts-expect-error typeof getRoot
      return getRoot(self).content.id;
    },
  }))
  .volatile(() => ({
    controllers: {
      tables: new AbortController(),
      columns: new AbortController(),
      indexes: new AbortController(),
      tableData: new AbortController(),
    },
  }))
  .actions((self) => ({
    setKeywords(table_schema: string, table_name: string) {
      self.table_schema = table_schema;
      self.table_name = table_name;
    },
  }))
  .actions((self) => ({
    initKeywords() {
      if (self.tables.empty) {
        return;
      }
      const table_schema = Object.keys(self.tables.data)[0];
      const table_name = self.tables.data[table_schema][0].table_name;
      self.setKeywords(table_schema, table_name);
    },
  }))
  .actions((self) => {
    const loadTables = flow(function* () {
      self.controllers.tables?.abort();
      self.controllers.tables = new AbortController();
      self.tables.state = 'loading';
      try {
        const tables: TableInfoType[] = yield* toGenerator(
          APIClient.query(self.controllers.tables.signal)(
            {
              type: self.type,
              key: self.key,
              query: self.tables.sql,
              query_id: 'builtin:load_table_schema',
              content_id: self.content_id,
            },
            {},
          ),
        );
        self.tables.data = _.groupBy(tables, 'table_schema');
        self.tables.state = 'idle';
        self.tables.error = null;

        self.initKeywords();
      } catch (error) {
        if (!axios.isCancel(error)) {
          self.tables.data = {};
          const fallback = _.get(error, 'message', 'unkown error');
          self.tables.error = _.get(error, 'response.data.detail.message', fallback) as unknown as QueryFailureError;
          self.tables.state = 'error';
        }
      }
    });

    return {
      loadTables,
      loadTablesIfEmpty() {
        if (self.tables.empty) {
          loadTables();
        }
      },
      loadColumns: flow(function* () {
        self.controllers.columns?.abort();
        self.controllers.columns = new AbortController();
        self.columns.state = 'loading';
        try {
          self.columns.data = yield* toGenerator(
            APIClient.query(self.controllers.columns.signal)(
              {
                type: self.type,
                key: self.key,
                query: self.columns.sql,
                query_id: 'builtin:load_columns',
                content_id: self.content_id,
              },
              {},
            ),
          );
          self.columns.state = 'idle';
          self.columns.error = null;
        } catch (error) {
          if (!axios.isCancel(error)) {
            self.columns.data = [];
            const fallback = _.get(error, 'message', 'unkown error');
            self.columns.error = _.get(error, 'response.data.detail.message', fallback) as unknown as QueryFailureError;
            self.columns.state = 'error';
          } else {
            self.columns.state = 'idle';
            self.columns.error = null;
          }
        }
      }),
      loadIndexes: flow(function* () {
        self.controllers.indexes?.abort();
        self.controllers.indexes = new AbortController();
        self.indexes.state = 'loading';
        try {
          self.indexes.data = yield* toGenerator(
            APIClient.query(self.controllers.indexes.signal)(
              {
                type: self.type,
                key: self.key,
                query: self.indexes.sql,
                query_id: 'builtin:load_indexes',
                content_id: self.content_id,
              },
              {},
            ),
          );
          self.indexes.state = 'idle';
          self.indexes.error = null;
        } catch (error) {
          if (!axios.isCancel(error)) {
            self.indexes.data = [];
            const fallback = _.get(error, 'message', 'unkown error');
            self.indexes.error = _.get(error, 'response.data.detail.message', fallback) as unknown as QueryFailureError;
            self.indexes.state = 'error';
          } else {
            self.indexes.state = 'idle';
            self.indexes.error = null;
          }
        }
      }),
      loadTableData: flow(function* () {
        self.controllers.tableData?.abort();
        self.controllers.tableData = new AbortController();
        const m = self.tableData;
        m.state = 'loading';
        try {
          m.data = yield* toGenerator(
            APIClient.query(self.controllers.tableData.signal)(
              {
                type: self.type,
                key: self.key,
                query: m.sql,
                query_id: 'builtin:load_table_data',
                content_id: self.content_id,
              },
              {},
            ),
          );
          const [{ total }] = yield* toGenerator(
            APIClient.query(self.controllers.tableData.signal)(
              {
                type: self.type,
                key: self.key,
                query: m.countSql,
                query_id: 'builtin:load_table_row_count',
                content_id: self.content_id,
              },
              {},
            ),
          );
          m.total = Number(total);
          m.state = 'idle';
          m.error = null;
        } catch (error) {
          if (!axios.isCancel(error)) {
            m.data = [];
            const fallback = _.get(error, 'message', 'unkown error');
            m.error = _.get(error, 'response.data.detail.message', fallback) as unknown as QueryFailureError;
            m.state = 'error';
          } else {
            m.state = 'idle';
            m.error = null;
          }
        }
      }),
    };
  })
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => self.columns.sql, self.loadColumns, {
          fireImmediately: false,
          delay: 500,
        }),
      );
    },
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => self.indexes.sql, self.loadIndexes, {
          fireImmediately: false,
          delay: 500,
        }),
      );
      addDisposer(
        self,
        reaction(() => self.tableData.sql, self.loadTableData, {
          fireImmediately: false,
          delay: 0,
        }),
      );
    },
  }));

export type DataSourceModelInstance = Instance<typeof DataSourceModel>;
