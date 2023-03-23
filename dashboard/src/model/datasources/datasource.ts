import axios from 'axios';
import _ from 'lodash';
import { flow } from 'mobx';
import { toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { TDataSourceConfig } from '~/api-caller/types';
import { AnyObject } from '~/types';
import { DataSourceType } from '../queries/types';

const Queries = {
  tables: `select * from information_schema.tables where table_schema = 'public' order by table_name`,
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
      tables: types.optional(types.frozen<AnyObject[]>(), []),
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
        self.tables = yield* toGenerator(
          APIClient.getRequest('POST', self.controller.signal)(
            '/query',
            { type: self.type, key: self.key, query: Queries.tables },
            {},
          ),
        );
        self.state = 'idle';
        self.error = null;
      } catch (error) {
        if (!axios.isCancel(error)) {
          self.tables.length = 0;
          const fallback = _.get(error, 'message', 'unkown error');
          self.error = _.get(error, 'response.data.detail.message', fallback) as QueryFailureError;
          self.state = 'error';
        }
      }
    });

    return {
      loadTables,
      loadTablesIfEmpty() {
        if (self.tables.length === 0) {
          loadTables();
        }
      },
    };
  });
