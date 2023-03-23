import axios from 'axios';
import _ from 'lodash';
import { flow, Instance, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { TDataSourceConfig } from '~/api-caller/types';
import { DataSourceType } from '../queries/types';

export type TableInfoType = {
  table_schema: string;
  table_name: string;
  table_type: string;
  engine: string;
};

export type TableInfoTreeType = Record<string, TableInfoType[]>;

const Queries = {
  tables: `select table_schema, table_name, table_type, engine from information_schema.tables where table_type = 'BASE TABLE' order by table_name`,
};

export const DataSourceModel = types
  .compose(
    'DataSourceModel',
    types.model({
      id: types.string,
      type: types.enumeration('DataSourceType', [DataSourceType.HTTP, DataSourceType.MySQL, DataSourceType.Postgresql]),
      key: types.string,
      config: types.frozen<TDataSourceConfig>(),
    }),
    types.model({
      tables: types.optional(types.frozen<TableInfoTreeType>(), {}),
      state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
      error: types.frozen(),
    }),
  )
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .views((self) => ({
    get loading() {
      return self.state === 'loading';
    },
  }))
  .actions((self) => {
    const loadTables = flow(function* () {
      self.controller?.abort();
      self.controller = new AbortController();
      self.state = 'loading';
      try {
        const tables = yield* toGenerator(
          APIClient.getRequest('POST', self.controller.signal)(
            '/query',
            { type: self.type, key: self.key, query: Queries.tables },
            {},
          ),
        );
        self.tables = _.groupBy(tables, 'table_schema');
        self.state = 'idle';
        self.error = null;
      } catch (error) {
        if (!axios.isCancel(error)) {
          self.tables = {};
          const fallback = _.get(error, 'message', 'unkown error');
          self.error = _.get(error, 'response.data.detail.message', fallback) as QueryFailureError;
          self.state = 'error';
        }
      }
    });

    return {
      loadTables,
      loadTablesIfEmpty() {
        if (Object.keys(self.tables).length === 0) {
          loadTables();
        }
      },
    };
  });

export type DataSourceModelInstance = Instance<typeof DataSourceModel>;
