import axios from 'axios';
import _ from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, Instance, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { DataSourceMetaModel } from '~/model/meta-model/datasources';
import { ColumnsModel } from './columns';
import { IndexesModel } from './indexes';
import { TableDataModel } from './table-data';
import { TableInfoType, TablesModel } from './tables';

export const DataSourceModel = types
  .compose(
    'DataSourceModel',
    DataSourceMetaModel,
    types.model({
      tables: types.optional(TablesModel, {}),
      columns: types.optional(ColumnsModel, {}),
      tableData: types.optional(TableDataModel, {}),
      indexes: types.optional(IndexesModel, {}),
      table_schema: types.optional(types.string, ''),
      table_name: types.optional(types.string, ''),
    }),
  )
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
            { type: self.type, key: self.key, query: self.tables.sql },
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
              { type: self.type, key: self.key, query: self.columns.sql },
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
              { type: self.type, key: self.key, query: self.indexes.sql },
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
            APIClient.query(self.controllers.tableData.signal)({ type: self.type, key: self.key, query: m.sql }, {}),
          );
          const [{ total }] = yield* toGenerator(
            APIClient.query(self.controllers.tableData.signal)(
              { type: self.type, key: self.key, query: m.countSql },
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
