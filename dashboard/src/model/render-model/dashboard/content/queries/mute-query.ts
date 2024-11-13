import { ComboboxItem, ComboboxItemGroup } from '@mantine/core';
import _ from 'lodash';
import { getParent, getRoot, Instance, isAlive } from 'mobx-state-tree';
import { DashboardFilterType, DataSourceType, QueryMeta } from '~/model';
import { explainHTTPRequest } from '~/utils';
import { explainSQL } from '~/utils';
import { DependencyInfo, UsageRegs } from '~/utils';

export const MuteQueryModel = QueryMeta.views((self) => ({
  get rootModel(): any {
    return getRoot(self);
  },
  get contentModel(): any {
    return this.rootModel.content; // dashboard content model
  },
  get conditionOptions() {
    if (!isAlive(self)) {
      return { optionGroups: [], validValues: new Set() };
    }

    const validValues: Set<string> = new Set();
    const { context } = this.contentModel.payloadForSQL;

    const contextGroup: ComboboxItemGroup = {
      group: 'context.label',
      items: Object.keys(context).map((k) => {
        const value = `context.${k}`;
        validValues.add(value);
        return {
          label: k,
          value,
          description: undefined,
          type: 'context',
        };
      }),
    };

    const filterGroup: ComboboxItemGroup = {
      group: 'filter.labels',
      items: this.contentModel.filters.keyLabelOptions.map((o: ComboboxItem & { widget: DashboardFilterType }) => {
        const value = `filters.${o.value}`;
        validValues.add(value);
        return {
          label: o.label,
          value,
          description: o.value,
          type: 'filter',
          widget: o.widget,
        };
      }),
    };

    const optionGroups: Array<ComboboxItemGroup> = [contextGroup, filterGroup];
    return { optionGroups, validValues };
  },
  get conditionOptionsWithInvalidRunbys() {
    const { optionGroups, validValues } = this.conditionOptions;
    const invalidGroup: ComboboxItemGroup = {
      group: 'common.invalid',
      items: [],
    };
    self.run_by.forEach((c) => {
      if (validValues.has(c)) {
        return;
      }
      invalidGroup.items.push({
        label: c,
        value: c,
      });
    });

    return {
      optionGroups: [...optionGroups, invalidGroup],
      validValues,
    };
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
    const payload = this.contentModel.payloadForSQL;

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

  get httpConfigString() {
    const { context, filters } = this.payload;
    const { name, pre_process } = self.json;

    const config = explainHTTPRequest(pre_process, context, filters);
    console.groupCollapsed(`Request config for: ${name}`);
    console.log(config);
    console.groupEnd();

    return JSON.stringify(config);
  },
  get typedAsSQL() {
    return [DataSourceType.Postgresql, DataSourceType.MySQL].includes(self.type);
  },
  get typedAsHTTP() {
    return [DataSourceType.HTTP].includes(self.type);
  },
  get isMericoMetricQuery() {
    return self.type === DataSourceType.MericoMetricSystem;
  },
  get isTransform() {
    return self.type === DataSourceType.Transform;
  },
  get reQueryKey() {
    const { react_to = [] } = self;
    if (react_to.length === 0) {
      return '';
    }
    const source = self.contentModel.payloadForSQL;
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
    const { keyLabelMap } = self.contentModel.filters;
    const contextNames = self.unmetRunByConditions
      .filter((k) => k.startsWith('context.'))
      .map((k) => k.replace('context.', ''));
    const filterNames = self.unmetRunByConditions
      .filter((k) => k.startsWith('filters.'))
      .map((k) => _.get({ filters: keyLabelMap }, k, k.replace('filters.', '')))
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
  get dependencies() {
    if (!this.typedAsSQL) {
      return [];
    }

    const sqlSnippetKeys = _.uniq(self.sql.match(UsageRegs.sqlSnippet));
    const filterKeys = _.uniq(self.sql.match(UsageRegs.filter));
    const contextKeys = _.uniq(self.sql.match(UsageRegs.context));

    const ret: DependencyInfo[] = [];
    sqlSnippetKeys.forEach((key) => {
      ret.push({ type: 'sql_snippet', key, valid: self.contentModel.sqlSnippets.keySet.has(key) });
    });

    filterKeys.forEach((key) => {
      ret.push({ type: 'filter', key, valid: self.contentModel.filters.keySet.has(key) });
    });

    contextKeys.forEach((key) => {
      ret.push({ type: 'context', key, valid: self.contentModel.mock_context.keySet.has(key) });
    });

    return ret;
  },
}));

export type MuteQueryModelInstance = Instance<typeof MuteQueryModel>;
