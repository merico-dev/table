import { destroy, getParent, getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';
import { MetricGroupByColOption } from '~/dashboard-editor/model/datasources/mm-info/metric-detail.utils';

type MetricQueryPayload = {
  id: string;
  type: MericoMetricType;
  filters: Record<string, { eq: string }>;
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

const MetricFilterColMeta = types
  .model('MetricFilterColMeta', {
    dimension: types.optional(types.string, ''),
    variable: types.optional(types.string, ''),
  })
  .views((self) => ({
    get allEmpty() {
      return !self.dimension && !self.variable;
    },
    get json() {
      const { dimension, variable } = self;
      return { dimension, variable };
    },
  }))
  .actions((self) => ({
    removeSelf() {
      const p = getParent(self, 2) as any;
      p.removeFilter(self);
    },
    setDimension(v: string | null) {
      self.dimension = v ?? '';
      if (self.allEmpty) {
        this.removeSelf();
      }
    },
    setVariable(v: string | null) {
      self.variable = v ?? '';
      if (self.allEmpty) {
        this.removeSelf();
      }
    },
  }));

type MetricFilterColMetaInstance = Instance<typeof MetricFilterColMeta>;

export type MericoMetricType = 'derived' | 'combined';

export const MericoMetricQueryMeta = types
  .model('MericoMetricQueryMeta', {
    _type: types.literal(DataSourceType.MericoMetricSystem),
    id: types.optional(types.string, ''),
    type: types.optional(types.enumeration('MetricType', ['derived', 'combined']), 'derived'),
    filters: types.optional(types.array(MetricFilterColMeta), []),
    groupBys: types.optional(types.array(types.string), []),
    timeQuery: types.model({
      enabled: types.optional(types.boolean, false),
      range_variable: types.optional(types.string, ''),
      unit_variable: types.optional(types.string, ''),
      timezone: types.optional(types.string, 'PRC'),
      stepKeyFormat: types.optional(types.string, 'YYYY-MM-DD'),
    }),
  })
  .views((self) => ({
    get valid() {
      return !!self.id;
    },
    get json() {
      const { id, type, filters, groupBys, timeQuery, _type } = self;
      return shallowToJS({ id, type, filters: filters.map((f) => f.json), groupBys, timeQuery, _type });
    },
    get usedFilterDimensionKeys() {
      const keys = self.filters.map((f) => f.dimension).filter((k) => !!k);
      return new Set(keys);
    },
    get usedFilterVariableSet() {
      const keys = [...self.filters.map((f) => f.variable)].filter((k) => !!k);
      return new Set(keys);
    },
    get usedTimeQueryVariableSet() {
      const keys = [self.timeQuery.range_variable, self.timeQuery.unit_variable].filter((k) => !!k);
      return new Set(keys);
    },
    get groupByValues() {
      const withoutLeaves = self.groupBys.map((g) => g.replace(/^(.+)\s->\s(.*)/, '$1'));
      return Array.from(new Set(withoutLeaves));
    },
    get queryPayload() {
      const filters = self.filters.reduce((acc, curr) => {
        acc[curr.dimension] = {
          eq: `TODO:${curr.variable}`,
        };
        return acc;
      }, {} as MetricQueryPayload['filters']);
      const ret: MetricQueryPayload = {
        id: self.id,
        type: self.type as MericoMetricType,
        filters,
        groupBys: self.groupBys,
      };
      if (self.timeQuery.enabled) {
        ret.timeQuery = {
          start: 'TODO',
          end: 'TODO',
          unitOfTime: 'TODO',
          unitNumber: 1,
          timezone: 'PRC',
          stepKeyFormat: 'YYYY-MM-DD',
        };
      }
      return ret;
    },
    get queryPayloadString() {
      return JSON.stringify(this.queryPayload, null, 2);
    },
  }))
  .actions((self) => ({
    reset() {
      self.filters.length = 0;
      self.groupBys.length = 0;
      self.timeQuery.enabled = false;
      self.timeQuery.range_variable = '';
      self.timeQuery.unit_variable = '';
    },
    setID(v: string) {
      if (v !== self.id) {
        this.reset();
      }
      self.id = v;
    },
    setType(type: string) {
      if (type !== 'derived' && type !== 'combined') {
        return;
      }
      self.type = type;
    },
    addFilter(k: string, v: string) {
      if (k && self.usedFilterDimensionKeys.has(k)) {
        return;
      }
      if (v && self.usedFilterVariableSet.has(v)) {
        return;
      }
      self.filters.push(
        MetricFilterColMeta.create({
          dimension: k,
          variable: v,
        }),
      );
    },
    removeFilter(filter: MetricFilterColMetaInstance) {
      destroy(filter);
    },
    setGroupBys(v: string[]) {
      self.groupBys.length = 0;
      self.groupBys.push(...v);
    },
    setRangeVariable(v: string | null) {
      self.timeQuery.range_variable = v ?? '';
    },
    setUnitVariable(v: string | null) {
      self.timeQuery.unit_variable = v ?? '';
    },
    setTimeQueryEnabled(v: boolean) {
      self.timeQuery.enabled = v;
      if (!v) {
        self.timeQuery.range_variable = '';
        self.timeQuery.unit_variable = '';
      } else if (self.groupBys.length > 1) {
        self.groupBys.length = 0;
      }
    },
  }));
export type MericoMetricQueryMetaInstance = Instance<typeof MericoMetricQueryMeta>;
export type MericoMetricQueryMetaSnapshotIn = SnapshotIn<MericoMetricQueryMetaInstance>;

export const createMericoMetricQueryMetaConfig = () =>
  MericoMetricQueryMeta.create({
    _type: DataSourceType.MericoMetricSystem,
    id: '',
    type: 'derived',
    filters: [],
    groupBys: [],
    timeQuery: {
      range_variable: '',
      unit_variable: '',
      timezone: 'PRC',
      stepKeyFormat: 'YYYY-MM-DD',
    },
  });
