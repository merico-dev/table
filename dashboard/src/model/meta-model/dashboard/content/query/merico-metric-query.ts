import type { IObservableArray } from 'mobx';
import { destroy, getParent, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { IQueryRenderModel } from '~/model/render-model';
import { typeAssert } from '~/types/utils';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';

const SqlMetricVariableMeta = types
  .model('SqlMetricVariableMeta', {
    sqlVar: types.optional(types.string, ''),
    variable: types.optional(types.string, ''),
  })
  .views((self) => ({
    get allEmpty() {
      return !self.sqlVar && !self.variable;
    },
    get json() {
      const { sqlVar, variable } = self;
      return { sqlVar, variable };
    },
  }))
  .actions((self) => ({
    removeSelf() {
      const p = getParent(self, 2) as any;
      p.removeSqlVariable(self);
    },
    setSqlVar(v: string | null) {
      self.sqlVar = v ?? '';
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

type SqlMetricVariableMetaInstance = Instance<typeof SqlMetricVariableMeta>;

export type ISqlMetricVariableMeta = {
  sqlVar: string;
  variable: string;
  allEmpty: boolean;
  json: { sqlVar: string; variable: string };
  removeSelf(): void;
  setSqlVar(v: string | null): void;
  setVariable(v: string | null): void;
};

typeAssert.shouldExtends<ISqlMetricVariableMeta, SqlMetricVariableMetaInstance>();

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

export type IMetricFilterColMeta = {
  dimension: string;
  variable: string;
  allEmpty: boolean;
  json: { dimension: string; variable: string };
  removeSelf(): void;
  setDimension(v: string | null): void;
  setVariable(v: string | null): void;
};

typeAssert.shouldExtends<IMetricFilterColMeta, MetricFilterColMetaInstance>();

export type MericoMetricType = 'derived' | 'combined' | 'sql';

export const MericoMetricQueryMeta = types
  .model('MericoMetricQueryMeta', {
    _type: types.literal(DataSourceType.MericoMetricSystem),
    id: types.optional(types.string, ''),
    type: types.optional(types.enumeration<MericoMetricType>('MetricType', ['derived', 'combined', 'sql']), 'derived'),
    filters: types.optional(types.array(MetricFilterColMeta), []),
    groupBys: types.optional(types.array(types.string), []),
    sqlVariables: types.optional(types.array(SqlMetricVariableMeta), []),
    timeQuery: types.model({
      enabled: types.optional(types.boolean, false),
      range_variable: types.optional(types.string, ''),
      unit_variable: types.optional(types.string, ''),
      timezone: types.optional(types.string, 'PRC'),
      stepKeyFormat: types.optional(types.string, 'YYYY-MM-DD'),
    }),
    useDefaultValues: types.optional(types.boolean, false),
    extraCalculations: types.optional(types.array(types.string), []),
  })
  .views((self) => ({
    get query() {
      return getParent(self) as any;
    },
    get valid() {
      return !!self.id;
    },
    get json() {
      const { id, type, filters, groupBys, timeQuery, useDefaultValues, extraCalculations, _type, sqlVariables } = self;
      return shallowToJS({
        id,
        type,
        filters: filters.map((f) => f.json),
        groupBys,
        timeQuery,
        useDefaultValues,
        extraCalculations,
        sqlVariables,
        _type,
      });
    },
    get usedSqlVariables() {
      return new Set(self.sqlVariables.map((it) => it.sqlVar));
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
  }))
  .actions((self) => ({
    reset() {
      self.filters.length = 0;
      self.groupBys.length = 0;
      self.timeQuery.enabled = false;
      self.timeQuery.range_variable = '';
      self.timeQuery.unit_variable = '';
      self.useDefaultValues = false;
      self.extraCalculations.length = 0;
      self.sqlVariables.length = 0;
      if ('data' in self.query) {
        self.query.setData([]);
        self.query.setError(null);
      }
    },
    setID(v: string) {
      if (v !== self.id) {
        this.reset();
      }
      self.id = v;
    },
    setType(type: string) {
      if (type !== 'derived' && type !== 'combined' && type !== 'sql') {
        return;
      }
      self.type = type;
    },
    addFilter(k: string, v: string) {
      if (k && self.usedFilterDimensionKeys.has(k)) {
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
    addSqlVariable(sqlVar: string, variable: string) {
      self.sqlVariables.push(
        SqlMetricVariableMeta.create({
          sqlVar,
          variable,
        }),
      );
    },
    removeSqlVariable(sqlVariable: SqlMetricVariableMetaInstance) {
      destroy(sqlVariable);
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
    setUseDefaultValues(v: boolean) {
      self.useDefaultValues = v;
    },
    setExtraCalculations(v: string[]) {
      self.extraCalculations.length = 0;
      self.extraCalculations.push(...v);
    },
  }));
export type MericoMetricQueryMetaInstance = Instance<typeof MericoMetricQueryMeta>;
export type MericoMetricQueryMetaSnapshotIn = SnapshotIn<MericoMetricQueryMetaInstance>;

export interface IMericoMetricQueryMeta {
  // Properties
  _type: DataSourceType.MericoMetricSystem;
  id: string;
  type: 'derived' | 'combined' | 'sql';
  filters: IObservableArray<IMetricFilterColMeta>;
  groupBys: IObservableArray<string>;
  sqlVariables: IObservableArray<ISqlMetricVariableMeta>;
  timeQuery: {
    enabled: boolean;
    range_variable: string;
    unit_variable: string;
    timezone: string;
    stepKeyFormat: string;
  };
  useDefaultValues: boolean;
  extraCalculations: IObservableArray<string>;

  // Views
  readonly query: IQueryRenderModel;
  readonly valid: boolean;
  readonly json: {
    id: string;
    type: 'derived' | 'combined' | 'sql';
    filters: Array<{
      dimension: string;
      variable: string;
    }>;
    groupBys: IObservableArray<string>;
    timeQuery: {
      enabled: boolean;
      range_variable: string;
      unit_variable: string;
      timezone: string;
      stepKeyFormat: string;
    };
    sqlVariables: IObservableArray<ISqlMetricVariableMeta>;
    useDefaultValues: boolean;
    extraCalculations: IObservableArray<string>;
    _type: DataSourceType.MericoMetricSystem;
  };
  readonly usedFilterDimensionKeys: Set<string>;
  readonly usedFilterVariableSet: Set<string>;
  readonly usedTimeQueryVariableSet: Set<string>;
  readonly groupByValues: string[];
  readonly usedSqlVariables: Set<string>;

  // Actions
  reset(): void;
  setID(v: string): void;
  setType(type: string): void;
  addFilter(k: string, v: string): void;
  removeFilter(filter: IMetricFilterColMeta): void;
  setGroupBys(v: string[]): void;
  setRangeVariable(v: string | null): void;
  setUnitVariable(v: string | null): void;
  setTimeQueryEnabled(v: boolean): void;
  setUseDefaultValues(v: boolean): void;
  setExtraCalculations(v: string[]): void;
  addSqlVariable(sqlVar: string, variable: string): void;
  removeSqlVariable(sqlVariable: ISqlMetricVariableMeta): void;
}

typeAssert.shouldExtends<IMericoMetricQueryMeta, MericoMetricQueryMetaInstance>();
typeAssert.shouldExtends<MericoMetricQueryMetaInstance, IMericoMetricQueryMeta>();

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
    useDefaultValues: false,
    extraCalculations: [],
  });
