import _ from 'lodash';
import { getRoot, Instance, isAlive, types } from 'mobx-state-tree';
import { DataSourceType } from './types';
import { shallowToJS } from '~/utils/shallow-to-js';

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
    react_to: types.optional(types.array(types.string), []),
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
      const { id, name, type, key, sql, run_by, react_to, pre_process, post_process } = self;
      return shallowToJS({ id, key, sql, name, type, run_by: run_by, react_to, pre_process, post_process });
    },
    get conditionOptions() {
      if (!isAlive(self)) {
        return [];
      }
      // @ts-expect-error untyped getRoot(self)
      const { context, mock_context, filterValues } = getRoot(self).content.payloadForSQL;
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
      // this computed has dependencies on reactive values outside the model,
      // so we need to check if the model is still alive
      if (!isAlive(self)) {
        return [];
      }
      const { run_by } = self;
      if (run_by.length === 0) {
        return [];
      }
      // @ts-expect-error untyped getRoot(self)
      const { context, mock_context, filterValues } = getRoot(self).content.payloadForSQL;
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
    get reQueryKey() {
      const { react_to = [] } = self;
      if (react_to.length === 0) {
        return '';
      }
      // @ts-expect-error untyped getRoot(self)
      const { context, mock_context, filterValues } = getRoot(self).content.payloadForSQL;
      const source = {
        context: {
          ...context,
          ...mock_context,
        },
        filters: filterValues,
      };
      const payload = [...react_to].reduce((acc, path) => {
        acc[path] = _.get(source, path);
        return acc;
      }, {} as Record<string, any>);

      return JSON.stringify(payload);
    },
    get runByConditionsMet() {
      return self.unmetRunByConditions.length === 0;
    },
    get conditionNames() {
      if (self.unmetRunByConditions.length === 0) {
        return { context: [], filters: [] };
      }
      // @ts-expect-error untyped getRoot(self)
      const { keyLabelMap } = getRoot(self).content.filters;
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
  }))
  .actions((self) => {
    return {
      setName(name: string) {
        self.name = name;
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
      setRunBy(v: string[]) {
        self.run_by.length = 0;
        self.run_by.push(...v);
      },
      setReactTo(v: string[]) {
        self.react_to.length = 0;
        self.react_to.push(...v);
      },
      setPreProcess(v: string) {
        self.pre_process = v;
      },
      setPostProcess(v: string) {
        self.post_process = v;
      },
    };
  });

export type MuteQueryModelInstance = Instance<typeof MuteQueryModel>;
