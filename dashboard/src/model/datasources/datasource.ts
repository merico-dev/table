import axios from 'axios';
import _ from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, Instance, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { TDataSourceConfig } from '~/api-caller/types';
import { DataSourceType } from '../queries/types';
import { ColumnsModel } from './columns';
import { IndexesModel } from './indexes';
import { TableInfoType, TablesModel } from './tables';

export const DataSourceModel = types
  .model('DataSourceModel', {
    id: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.HTTP, DataSourceType.MySQL, DataSourceType.Postgresql]),
    key: types.string,
    config: types.frozen<TDataSourceConfig>(),
    tables: types.optional(TablesModel, {}),
    columns: types.optional(ColumnsModel, {}),
    indexes: types.optional(IndexesModel, {}),
  })
  .volatile(() => ({
    controllers: {
      tables: new AbortController(),
      columns: new AbortController(),
      indexes: new AbortController(),
    },
  }))
  .actions((self) => ({
    initKeywords() {
      if (self.tables.empty) {
        return;
      }
      const table_schema = Object.keys(self.tables.data)[0];
      const table_name = self.tables.data[table_schema][0].table_name;
      self.columns.setKeywords(table_schema, table_name);
      self.indexes.setKeywords(table_schema, table_name);
    },
  }))
  .actions((self) => {
    const loadTables = flow(function* () {
      self.controllers.tables?.abort();
      self.controllers.tables = new AbortController();
      self.tables.state = 'loading';
      try {
        const tables: TableInfoType[] = yield* toGenerator(
          APIClient.getRequest('POST', self.controllers.tables.signal)(
            '/query',
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
          self.tables.error = _.get(error, 'response.data.detail.message', fallback) as QueryFailureError;
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
            APIClient.getRequest('POST', self.controllers.columns.signal)(
              '/query',
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
            self.columns.error = _.get(error, 'response.data.detail.message', fallback) as QueryFailureError;
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
            APIClient.getRequest('POST', self.controllers.indexes.signal)(
              '/query',
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
            self.indexes.error = _.get(error, 'response.data.detail.message', fallback) as QueryFailureError;
            self.indexes.state = 'error';
          } else {
            self.indexes.state = 'idle';
            self.indexes.error = null;
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
    },
  }));

export type DataSourceModelInstance = Instance<typeof DataSourceModel>;
