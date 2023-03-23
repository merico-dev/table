import axios from 'axios';
import _ from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, Instance, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { TDataSourceConfig } from '~/api-caller/types';
import { DataSourceType } from '../queries/types';
import { ColumnsModel } from './columns';
import { TableInfoType, TablesModel } from './tables';

export const DataSourceModel = types
  .model('DataSourceModel', {
    id: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.HTTP, DataSourceType.MySQL, DataSourceType.Postgresql]),
    key: types.string,
    config: types.frozen<TDataSourceConfig>(),
    tables: types.optional(TablesModel, {}),
    columns: types.optional(ColumnsModel, {}),
  })
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .actions((self) => ({
    initColumnKeywords() {
      if (self.tables.empty) {
        return;
      }
      const table_schema = Object.keys(self.tables.data)[0];
      const table_name = self.tables.data[table_schema][0].table_name;
      self.columns.setKeywords(table_schema, table_name);
    },
  }))
  .actions((self) => {
    const loadTables = flow(function* () {
      self.controller?.abort();
      self.controller = new AbortController();
      self.tables.state = 'loading';
      try {
        const tables: TableInfoType[] = yield* toGenerator(
          APIClient.getRequest('POST', self.controller.signal)(
            '/query',
            { type: self.type, key: self.key, query: self.tables.sql },
            {},
          ),
        );
        self.tables.data = _.groupBy(tables, 'table_schema');
        self.tables.state = 'idle';
        self.tables.error = null;

        self.initColumnKeywords();
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
        self.controller?.abort();
        self.controller = new AbortController();
        self.columns.state = 'loading';
        try {
          self.columns.data = yield* toGenerator(
            APIClient.getRequest('POST', self.controller.signal)(
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
          }
        }
      }),
    };
  })
  .actions((self) => {
    return {
      afterCreate() {
        addDisposer(
          self,
          reaction(() => self.columns.sql, self.loadColumns, {
            fireImmediately: false,
            delay: 500,
          }),
        );
      },
    };
  });

export type DataSourceModelInstance = Instance<typeof DataSourceModel>;
