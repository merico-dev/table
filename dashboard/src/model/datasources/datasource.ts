import axios from 'axios';
import _ from 'lodash';
import { flow, Instance, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { TDataSourceConfig } from '~/api-caller/types';
import { DataSourceType } from '../queries/types';
import { TablesModel } from './tables';

const Queries = {
  tables: `select table_schema, table_name, table_type, engine from information_schema.tables where table_type = 'BASE TABLE' order by table_name`,
};

export const DataSourceModel = types
  .model('DataSourceModel', {
    id: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.HTTP, DataSourceType.MySQL, DataSourceType.Postgresql]),
    key: types.string,
    config: types.frozen<TDataSourceConfig>(),
    tables: types.optional(TablesModel, {}),
  })
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .actions((self) => {
    const loadTables = flow(function* () {
      self.controller?.abort();
      self.controller = new AbortController();
      self.tables.state = 'loading';
      try {
        const tables = yield* toGenerator(
          APIClient.getRequest('POST', self.controller.signal)(
            '/query',
            { type: self.type, key: self.key, query: Queries.tables },
            {},
          ),
        );
        self.tables.data = _.groupBy(tables, 'table_schema');
        self.tables.state = 'idle';
        self.tables.error = null;
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
    };
  });

export type DataSourceModelInstance = Instance<typeof DataSourceModel>;
