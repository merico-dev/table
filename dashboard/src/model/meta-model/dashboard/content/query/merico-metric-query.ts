import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';

export type MericoMetricType = 'derived' | 'combined';

export const MericoMetricQueryMeta = types
  .model('MericoMetricQueryMeta', {
    _type: types.literal(DataSourceType.MericoMetricSystem),
    id: types.optional(types.string, ''),
    type: types.optional(types.enumeration('MetricType', ['derived', 'combined']), 'derived'),
    filters: types.optional(types.frozen<Record<string, string>>(), {}),
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
      return shallowToJS({ id, type, filters, groupBys, timeQuery, _type });
    },
    get selectedDimensionSet() {
      const keys = [...Object.keys(self.filters), ...self.groupBys].filter((k) => !!k);
      return new Set(keys);
    },
    get selectedVariableSet() {
      const keys = [...Object.values(self.filters), self.timeQuery.range_variable, self.timeQuery.unit_variable].filter(
        (k) => !!k,
      );
      return new Set(keys);
    },
  }))
  .actions((self) => ({
    setID(v: string) {
      self.id = v;
    },
    setType(type: string) {
      if (type !== 'derived' && type !== 'combined') {
        return;
      }
      self.type = type;
    },
    addFilter(k: string) {
      if (k in self.filters) {
        return;
      }
      self.filters = {
        ...self.filters,
        [k]: '',
      };
    },
    changeFilterVariable(k: string, v: string | null) {
      self.filters = {
        ...self.filters,
        [k]: v ?? '',
      };
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
    filters: {},
    groupBys: [],
    timeQuery: {
      range_variable: '',
      unit_variable: '',
      timezone: 'PRC',
      stepKeyFormat: 'YYYY-MM-DD',
    },
  });
