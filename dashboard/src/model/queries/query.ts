import { reaction } from 'mobx';
import { getType, Instance, types, flow, toGenerator, getRoot, addDisposer } from 'mobx-state-tree';
import { queryBySQL } from '../../api-caller';
import { MuteQueryModel } from './mute-query';

export enum DataSourceType {
  Postgresql = 'postgresql',
  MySQL = 'mysql',
  HTTP = 'http',
}

export const QueryModel = types
  .compose(
    'QueryModel',
    MuteQueryModel,
    types.model({
      state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
      data: types.optional(types.array(types.frozen<Object>()), []),
      error: types.frozen(),
    }),
  )
  .actions((self) => ({
    setID(id: string) {
      self.id = id;
    },
    setKey(key: string) {
      self.key = key;
    },
    setType(type: DataSourceType) {
      self.type = type;
    },
    setSQL(sql: string) {
      self.sql = sql;
    },
    fetchData: flow(function* () {
      if (!self.valid) {
        return;
      }
      self.state = 'loading';
      try {
        const title = self.id;
        const dashboard = getRoot(self);
        self.data = yield* toGenerator(
          queryBySQL({
            // @ts-expect-error
            context: dashboard.context.current,
            // @ts-expect-error
            sqlSnippets: dashboard.sqlSnippets.current,
            title,
            query: {
              type: self.type,
              key: self.key,
              sql: self.sql,
            },
            filterValues: {},
          }),
        );
        self.state = 'idle';
      } catch (error) {
        console.error(error);
        self.error = error;
        self.state = 'error';
      }
    }),
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => `${self.id}--${self.key}--${self.type}--${self.sql}`, self.fetchData, {
          fireImmediately: true,
          delay: 500,
        }),
      );
    },
  }));

export type QueryModelInstance = Instance<typeof QueryModel>;
