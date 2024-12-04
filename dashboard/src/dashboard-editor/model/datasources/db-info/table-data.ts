import { reaction } from 'mobx';
import { addDisposer, getParent, types } from 'mobx-state-tree';
import { AnyObject } from '~/types';

export const TableDataModel = types
  .model({
    page: types.optional(types.number, 1),
    limit: types.optional(types.number, 20),
    data: types.optional(types.frozen<AnyObject[]>(), []),
    total: types.optional(types.number, 0),
    state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
    error: types.frozen(),
  })
  .views((self) => ({
    get keywords() {
      const payload: { table_name: string; table_schema: string } = getParent(self, 1);
      return payload;
    },
    get keywordString() {
      const { table_name, table_schema }: { table_name: string; table_schema: string } = getParent(self, 1);
      return `${table_schema}||${table_name}`;
    },
  }))
  .views((self) => ({
    get loading() {
      return self.state === 'loading';
    },
    get empty() {
      return self.data.length === 0;
    },
    get maxPage() {
      return Math.ceil(self.total / self.limit);
    },
    get offset() {
      return (self.page - 1) * self.limit;
    },
    get countSql() {
      const { table_name, table_schema } = self.keywords;
      return `
        SELECT count(*) AS total
        FROM ${table_schema}.${table_name}
      `;
    },
  }))
  .actions((self) => ({
    setPage(page: number) {
      self.page = page;
    },
    resetPage() {
      self.page = 1;
    },
    setLimit(limit: number) {
      self.limit = limit;
    },
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => self.keywordString, self.resetPage, {
          fireImmediately: false,
          delay: 0,
        }),
      );
      addDisposer(
        self,
        reaction(() => self.limit, self.resetPage, {
          fireImmediately: false,
          delay: 0,
        }),
      );
    },
  }));
