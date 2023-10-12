import { SelectItem } from '@mantine/core';
import _ from 'lodash';
import { getParent, getRoot, Instance, isAlive } from 'mobx-state-tree';
import { DataSourceType, QueryMeta } from '~/model';
import { explainSQL } from '~/utils/sql';

export const MuteQueryModel = QueryMeta.views((self) => ({
  get rootModel(): any {
    return getRoot(self);
  },
  get contentModel(): any {
    return this.rootModel.content; // dashboard content model
  },
  get conditionOptions() {
    if (!isAlive(self)) {
      return [];
    }
    // @ts-expect-error untyped getRoot(self)
    const contentModel = getRoot(self).content;

    const { context } = contentModel.payloadForSQL;
    const contextOptions: SelectItem[] = Object.keys(context).map((k) => ({
      group: 'Context',
      label: k,
      value: `context.${k}`,
      description: undefined,
    }));

    const filterOptions: SelectItem[] = contentModel.filters.keyLabelOptions.map((o: SelectItem) => ({
      group: 'Filters',
      label: o.label,
      value: `filters.${o.value}`,
      description: o.value,
    }));

    return [...contextOptions, ...filterOptions];
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
  get payload() {
    return self.contentModel.payloadForSQL;
  },
  get formattedSQL() {
    return explainSQL(self.sql, this.payload);
  },
  get typedAsSQL() {
    return [DataSourceType.Postgresql, DataSourceType.MySQL].includes(self.type);
  },
  get typedAsHTTP() {
    return [DataSourceType.HTTP].includes(self.type);
  },
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
  get queries() {
    return getParent(self, 2) as any;
  },
  get inUse() {
    return this.queries.isQueryInUse(self.id);
  },
}));

export type MuteQueryModelInstance = Instance<typeof MuteQueryModel>;
