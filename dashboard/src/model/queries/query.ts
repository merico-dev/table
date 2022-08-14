import { Instance, types, flow, toGenerator, getRoot } from 'mobx-state-tree';
import { queryBySQL } from '../../api-caller';

export enum DataSourceType {
  Postgresql = 'postgresql',
  MySQL = 'mysql',
  HTTP = 'http',
}

export const QueryModel = types
  .model('QueryModel', {
    id: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.Postgresql, DataSourceType.MySQL, DataSourceType.HTTP]),
    key: types.string,
    sql: types.string,
    state: types.optional(types.enumeration(['idle', 'loading', 'loaded', 'error']), 'idle'),
    data: types.optional(types.array(types.frozen<Object>()), []),
    error: types.frozen(),
  })
  .views((self) => ({
    get valid() {
      return self.id && self.type && self.key && self.sql;
    },
  }))
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
      self.state = 'loading';
      try {
        const dashboard = getRoot(self);
        self.data = yield* toGenerator(
          queryBySQL({
            // @ts-expect-error
            context: dashboard.context.current.toJSON(),
            // @ts-expect-error
            sqlSnippets: dashboard.sqlSnippets.current,
            title: self.key,
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
        self.error = error;
        self.state = 'error';
      }
    }),
  }));

export type QueryModelInstance = Instance<typeof QueryModel>;
