import { ComboboxItem, ComboboxItemGroup } from '@mantine/core';
import dayjs from 'dayjs';
import _ from 'lodash';
import { getParent, getRoot, Instance, isAlive } from 'mobx-state-tree';
import { IContentRenderModel } from '~/dashboard-render';
import {
  DashboardFilterType,
  DataSourceType,
  MericoMetricQueryMetaInstance,
  MericoMetricType,
  QueryMeta,
  type IQueryMeta,
} from '~/model';
import { typeAssert } from '~/types/utils';
import { explainHTTPRequest } from '~/utils';
import { explainSQL } from '~/utils';
import { DependencyInfo, UsageRegs } from '~/utils';

type MetricQueryPayload = {
  id: string;
  type: MericoMetricType;
  filters: Record<string, { eq: string } | { in: Array<string> } | { between: [number, number] | any[] }>;
  groupBys: string[];
  timeQuery?: {
    start: string;
    end: string;
    unitOfTime: string;
    unitNumber: 1; //目前不支持配置这个字段，只用unitOfTime即可
    timezone: string;
    stepKeyFormat: 'YYYY-MM-DD';
  };
};

export const MuteQueryModel = QueryMeta.views((self) => ({
  get rootModel(): any {
    return getRoot(self);
  },
  get contentModel(): any {
    return this.rootModel.content; // dashboard content model
  },
  get conditionOptions(): { optionGroups: Array<ComboboxItemGroup<ComboboxItem>>; validValues: Set<string> } {
    if (!isAlive(self)) {
      return { optionGroups: [], validValues: new Set() };
    }

    const validValues: Set<string> = new Set();
    const { context } = this.contentModel.payloadForSQL;

    const contextGroup: ComboboxItemGroup<ComboboxItem> = {
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

    const filterGroup: ComboboxItemGroup<ComboboxItem> = {
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

    const optionGroups: Array<ComboboxItemGroup<ComboboxItem>> = [contextGroup, filterGroup];
    return { optionGroups, validValues };
  },
  getConditionOptionsWithInvalidValue(value: string | null) {
    const { optionGroups, validValues } = this.conditionOptions;
    if (!value || validValues.has(value)) {
      return this.conditionOptions;
    }

    const invalidGroup: ComboboxItemGroup<ComboboxItem> = {
      group: 'common.invalid',
      items: [
        {
          label: value,
          value,
        },
      ],
    };
    return {
      optionGroups: [...optionGroups, invalidGroup],
      validValues,
    };
  },
  get conditionOptionsWithInvalidRunbys(): {
    optionGroups: Array<ComboboxItemGroup<ComboboxItem>>;
    validValues: Set<string>;
  } {
    const { optionGroups, validValues } = this.conditionOptions;
    const invalidGroup: ComboboxItemGroup<ComboboxItem> = {
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
    const sql = _.get(self, 'config.sql', '');
    return explainSQL(sql, this.payload);
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
    const react_to = _.get(self, 'config.react_to', []);
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

    const sql = _.get(self, 'config.sql', '') as string;
    if (!sql) {
      return [];
    }

    const sqlSnippetKeys = _.uniq(sql.match(UsageRegs.sqlSnippet));
    const filterKeys = _.uniq(sql.match(UsageRegs.filter));
    const contextKeys = _.uniq(sql.match(UsageRegs.context));

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
  get usedFilterKeySet() {
    const ret: Set<string> = new Set();
    const addToSet = (keyWithPrefix: string) => {
      ret.add(keyWithPrefix.replace(/^filters\./, ''));
    };
    self.run_by.forEach((k) => addToSet(k));
    const react_to = _.get(self.config, 'react_to', []);
    react_to.forEach((k) => addToSet(k));
    if (!this.typedAsSQL) {
      return ret;
    }
    const sql = _.get(self, 'config.sql', '') as string;
    if (!sql) {
      return ret;
    }
    const filterKeys = _.uniq(sql.match(UsageRegs.filter));
    filterKeys.forEach((k) => addToSet(k));
    return ret;
  },
  get metricQueryPayload() {
    if (self.type !== DataSourceType.MericoMetricSystem) {
      return null;
    }
    const payload = this.payload;
    const types = { filters: self.contentModel.filters.keysToTypes };
    const config = self.config as MericoMetricQueryMetaInstance;
    const filters = config.filters.reduce((acc, curr) => {
      const v = _.get(payload, curr.variable);
      const t = _.get(types, curr.variable);
      const d = curr.dimension;
      if (t === DashboardFilterType.DateRange) {
        const allNumber = v.every((d: string) => Number.isFinite(Number(d)));
        const between = allNumber ? v.map((d: string) => Number(d)) : v;
        acc[d] = {
          between,
        };
      } else if (Array.isArray(v)) {
        acc[d] = {
          in: v,
        };
      } else {
        acc[d] = {
          eq: v,
        };
      }

      return acc;
    }, {} as MetricQueryPayload['filters']);
    const ret: MetricQueryPayload = {
      id: config.id,
      type: config.type as MericoMetricType,
      filters,
      groupBys: config.groupBys,
    };
    if (!config.timeQuery.enabled) {
      return ret;
    }
    const { range_variable, unit_variable } = config.timeQuery;
    const stepKeyFormat = 'YYYY-MM-DD';
    const timezone = 'PRC';
    const timeQuery: MetricQueryPayload['timeQuery'] = {
      start: '',
      end: '',
      unitOfTime: _.get(payload, unit_variable, ''),
      unitNumber: 1,
      timezone: 'PRC',
      stepKeyFormat,
    };
    if (range_variable) {
      const range = _.get(payload, range_variable);
      if (Array.isArray(range) && range.length === 2) {
        timeQuery.start = dayjs(range[0]).tz(timezone).format(stepKeyFormat);
        timeQuery.end = dayjs(range[1]).tz(timezone).format(stepKeyFormat);
      }
    }

    ret.timeQuery = timeQuery;
    return ret;
  },
  get metricQueryPayloadString() {
    if (!this.metricQueryPayload) {
      return '';
    }
    return JSON.stringify(this.metricQueryPayload, null, 2);
  },
  get metricQueryPayloadError() {
    const errors: string[] = [];
    if (!this.metricQueryPayload) {
      return errors;
    }
    const config = self.config as MericoMetricQueryMetaInstance;
    const { timeQuery } = this.metricQueryPayload;
    if (!timeQuery) {
      if (config.groupByValues.length > 2) {
        errors.push('分组聚合维度：最多支持两个维度的聚合计算');
      }
      return errors;
    }
    if (config.groupByValues.length > 1) {
      errors.push('分组聚合维度：按时间序列展示时，仅可选择一个聚合维度');
    }
    const { start, end, unitOfTime } = timeQuery;
    if (!start || !end) {
      errors.push('时间维度：时间范围不完整');
    }
    if (!unitOfTime) {
      errors.push('步长：必选');
    }
    return errors;
  },
  get metricQueryPayloadErrorString() {
    return this.metricQueryPayloadError.join('\n');
  },
  get metricQueryPayloadValid() {
    if (!this.metricQueryPayload) {
      return false;
    }
    return this.metricQueryPayloadError.length === 0;
  },
}));

export type MuteQueryModelInstance = Instance<typeof MuteQueryModel>;

export interface IMuteQueryModel extends IQueryMeta {
  // Views
  readonly rootModel: Record<string, unknown>;
  readonly contentModel: IContentRenderModel;
  readonly conditionOptions: {
    optionGroups: Array<ComboboxItemGroup<ComboboxItem>>;
    validValues: Set<string>;
  };
  readonly payload: Record<string, unknown>;
  readonly formattedSQL: string;
  readonly httpConfigString: string;
  readonly typedAsSQL: boolean;
  readonly typedAsHTTP: boolean;
  readonly isMericoMetricQuery: boolean;
  readonly isTransform: boolean;
  readonly reQueryKey: string;
  readonly runByConditionsMet: boolean;
  readonly conditionNames: {
    context: string[];
    filters: string[];
  };
  readonly queries: string[];
  readonly inUse: boolean;
  readonly dependencies: DependencyInfo[];
  readonly usedFilterKeySet: Set<string>;
  readonly metricQueryPayload: MetricQueryPayload | null;
  readonly metricQueryPayloadString: string;
  readonly metricQueryPayloadError: string[];
  readonly metricQueryPayloadErrorString: string;
  readonly metricQueryPayloadValid: boolean;
  readonly unmetRunByConditions: string[];
  readonly conditionOptionsWithInvalidRunbys: {
    optionGroups: Array<ComboboxItemGroup<ComboboxItem>>;
    validValues: Set<string>;
  };

  // Methods
  getConditionOptionsWithInvalidValue(value: string | null): {
    optionGroups: Array<ComboboxItemGroup<ComboboxItem>>;
    validValues: Set<string>;
  };
}

typeAssert.shouldExtends<IMuteQueryModel, MuteQueryModelInstance>();
typeAssert.shouldExtends<MuteQueryModelInstance, IMuteQueryModel>();
