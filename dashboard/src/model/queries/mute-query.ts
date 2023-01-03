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
    run_by: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get valid() {
      return self.id && self.type && self.key && self.sql && self.name;
    },
    get json() {
      const { id, name, type, key, sql, run_by } = self;
      return { id, name, type, key, sql, run_by };
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
    get conditionNames() {
      if (self.run_by.length === 0) {
        return { context: [], filters: [] };
      }
      // @ts-expect-error untyped getRoot(self)
      const { keyLabelMap } = getRoot(self).filters;
      const contextNames = self.run_by.filter((k) => k.startsWith('context.')).map((k) => k.split('context.')[0]);
      const filterNames = self.run_by
        .filter((k) => k.startsWith('filters.'))
        .map((k) => _.get({ filters: keyLabelMap }, k))
        .filter((v) => !!v);
      return {
        context: contextNames,
        filters: filterNames,
      };
    },
    get runByConditionsMet() {
      const { run_by } = self;
      if (run_by.length === 0) {
        return true;
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

      return run_by.every((c) => {
        const value = _.get(payload, c);
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return !!value;
      });
    },
  }));

export type MuteQueryModelInstance = Instance<typeof MuteQueryModel>;
