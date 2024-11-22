import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import { DataSourceType } from './types';

export type MericoMetricType = 'derived' | 'combined';
export type MericoMetricQueryFilter = {
  dimension: string;
  variable: string;
};

export const MericoMetricQueryMeta = types
  .model('MericoMetricQueryMeta', {
    _type: types.literal(DataSourceType.MericoMetricSystem),
    id: types.optional(types.string, ''),
    type: types.optional(types.enumeration('MetricType', ['derived', 'combined']), 'derived'),
    filters: types.optional(types.array(types.frozen<MericoMetricQueryFilter>()), []),
    groupBys: types.optional(types.array(types.string), []),
    timeQuery: types.model({
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
    setFilters(v: MericoMetricQueryFilter[]) {
      self.filters.length = 0;
      self.filters.push(...v);
    },
    setGroupBys(v: string[]) {
      self.groupBys.length = 0;
      self.groupBys.push(...v);
    },
    setRangeVariable(v: string) {
      self.timeQuery.range_variable = v;
    },
    setUnitVariable(v: string) {
      self.timeQuery.unit_variable = v;
    },
  }));
export type MericoMetricQueryMetaInstance = Instance<typeof MericoMetricQueryMeta>;
export type MericoMetricQueryMetaSnapshotIn = SnapshotIn<MericoMetricQueryMetaInstance>;
