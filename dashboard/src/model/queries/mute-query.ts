import _ from 'lodash';
import { getRoot, Instance, types } from 'mobx-state-tree';
import { DataSourceType } from './types';

export const MuteQueryModel = types
  .model('QueryModel', {
    id: types.string,
    name: types.string,
    type: types.enumeration('DataSourceType', [DataSourceType.Postgresql, DataSourceType.MySQL, DataSourceType.HTTP]),
    key: types.string,
    sql: types.string,
    pre_process: types.optional(types.string, ''),
    post_process: types.optional(types.string, ''),
    run_by: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get valid() {
      const infoValid = self.id && self.type && self.key && self.name;
      if (!infoValid) {
        return false;
      }
      if (self.type === DataSourceType.HTTP) {
        return !!self.pre_process;
      }
      return !!self.sql;
    },
    get json() {
      const { id, name, type, key, sql, run_by, pre_process, post_process } = self;
      return { id, name, type, key, sql, run_by, pre_process, post_process };
    },
    get conditionOptions() {
      // @ts-expect-error untyped getRoot(self)
      const { context, mock_context, filterValues } = getRoot(self).payloadForSQL;
      const contextOptions = Object.keys({ ...mock_context, ...context }).map((k) => `context.${k}`);
      const filterOptions = Object.keys(filterValues).map((k) => `filters.${k}`);
      const keys = [...contextOptions, ...filterOptions];
      return keys.map((k) => ({
        label: k.split('.')[1],
        value: k,
        group: _.capitalize(k.split('.')[0]),
      }));
    },
    get unmetRunByConditions() {
      const { run_by } = self;
      if (run_by.length === 0) {
        return [];
      }
      // @ts-expect-error untyped getRoot(self)
      const { context, mock_context, filterValues } = getRoot(self).payloadForSQL;
      const payload = {
        context: {
          ...mock_context,
          ...context,
        },
        filters: filterValues,
      };

      return run_by.filter((c) => {
        const value = _.get(payload, c);
        if (Array.isArray(value)) {
          return value.length === 0;
        }
        if (typeof value === 'number') {
          return Number.isNaN(value);
        }
        return !value;
      });
    },
  }))
  .views((self) => ({
    get runByConditionsMet() {
      return self.unmetRunByConditions.length === 0;
    },
    get conditionNames() {
      if (self.unmetRunByConditions.length === 0) {
        return { context: [], filters: [] };
      }
      // @ts-expect-error untyped getRoot(self)
      const { keyLabelMap } = getRoot(self).filters;
      const contextNames = self.unmetRunByConditions
        .filter((k) => k.startsWith('context.'))
        .map((k) => k.split('context.')[0]);
      const filterNames = self.unmetRunByConditions
        .filter((k) => k.startsWith('filters.'))
        .map((k) => _.get({ filters: keyLabelMap }, k))
        .filter((v) => !!v);
      return {
        context: contextNames,
        filters: filterNames,
      };
    },
  }));

export type MuteQueryModelInstance = Instance<typeof MuteQueryModel>;
