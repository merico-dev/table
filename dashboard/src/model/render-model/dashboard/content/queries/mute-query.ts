import _ from 'lodash';
import { getRoot, Instance, isAlive } from 'mobx-state-tree';
import { QueryMeta } from '~/model';

export const MuteQueryModel = QueryMeta.views((self) => ({
  get conditionOptions() {
    if (!isAlive(self)) {
      return [];
    }
    // @ts-expect-error untyped getRoot(self)
    const { context, filters } = getRoot(self).content.payloadForSQL;
    const contextOptions = Object.keys({ ...context }).map((k) => `context.${k}`);
    const filterOptions = Object.keys(filters).map((k) => `filters.${k}`);
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
    const payload = getRoot(self).content.payloadForSQL;

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
})).views((self) => ({
  get reQueryKey() {
    const { react_to = [] } = self;
    if (react_to.length === 0) {
      return '';
    }
    // @ts-expect-error untyped getRoot(self)
    const source = getRoot(self).content.payloadForSQL;
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
}));

export type MuteQueryModelInstance = Instance<typeof MuteQueryModel>;
