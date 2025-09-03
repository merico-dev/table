import axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, getParent, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { DataSourceType } from '~/model';
import { postProcessWithDataSource, preProcessWithDataSource } from '~/utils';
import { CombinedMetricCol, MetricDetail, MetricSourceCol } from './metric-detail.types';
import { makeFilterColOptions, makeGroupByColOptions, MetricGroupByColOption, parseData } from './metric-detail.utils';

function getURLByType(type: 'derived' | 'combined', id: string) {
  if (!id) {
    throw new Error(`Shouldnt run query without ID`);
  }

  if (type === 'derived') {
    return `/api/metric_management/derived_metric/${id}`;
  }
  if (type === 'combined') {
    return `/api/metric_management/combined_metric/${id}`;
  }
  if (type === 'sql') {
    return `/api/metric_management/sql_metric/${id}`;
  }
  throw new Error(`Unexpected metric type[${type}]`);
}

export const MetricDetailModel = types
  .model({
    data: types.optional(types.frozen<MetricDetail | null>(), null),
    variables: types.optional(types.frozen<string[]>(), []),
    filters: types.optional(types.frozen<Array<CombinedMetricCol | MetricSourceCol>>(), []),
    groupBys: types.optional(types.frozen<Array<CombinedMetricCol | MetricSourceCol>>(), []),
    trendingDateCol: types.optional(types.frozen<MetricSourceCol | null>(), null),
    supportTrending: types.optional(types.boolean, false),
    state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
    error: types.frozen(),
  })
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .views((self) => ({
    get loading() {
      return self.state === 'loading';
    },
    get hasData() {
      return self.data !== null;
    },
    get mmInfo() {
      return getParent(self) as any;
    },
    get metricID() {
      return this.mmInfo.metricID as string;
    },
    get metric() {
      return this.mmInfo.metric;
    },
    get metricType() {
      return this.metric?.type;
    },
    get filterColOptions() {
      return makeFilterColOptions(self.filters);
    },
    get groupByColOptions() {
      return makeGroupByColOptions(self.groupBys);
    },
    get flatGroupByColOptions() {
      const groupedOptions = this.groupByColOptions;
      const ret: MetricGroupByColOption['items'] = [];
      groupedOptions.forEach(({ group, items }) => {
        ret.push(...items);
      });
      return ret;
    },
    getGroupByOptions(values: string[]) {
      const set = new Set(values);
      return this.flatGroupByColOptions.filter((o) => set.has(o.value));
    },
  }))
  .actions((self) => ({
    load: flow(function* () {
      if (self.mmInfo.type !== DataSourceType.MericoMetricSystem) {
        return;
      }
      if (!self.metricID || !self.metricType) {
        return;
      }

      self.controller?.abort();
      self.controller = new AbortController();
      self.state = 'loading';
      try {
        const url = getURLByType(self.metricType, self.metricID);
        const config = preProcessWithDataSource(self.mmInfo.dataSource, {
          url,
          method: 'GET',
          data: {
            key: self.mmInfo.key,
          },
        });
        const response = yield* toGenerator(
          APIClient.mericoMetricInfo<AxiosResponse<MetricDetail>>(self.controller.signal)(
            {
              key: self.mmInfo.key,
              query: JSON.stringify(config),
              ...self.mmInfo.additionalQueryInfo,
            },
            self.controller.signal,
          ),
        );
        const result = postProcessWithDataSource(self.mmInfo.dataSource, response);
        const data = _.cloneDeep(result.data);
        const { filters, groupBys, trendingDateCol, supportTrending, variables } = parseData(result.data);
        self.data = data;
        self.variables = variables;
        self.filters = filters;
        self.groupBys = groupBys;
        self.supportTrending = supportTrending;
        self.trendingDateCol = trendingDateCol;
        self.state = 'idle';
        self.error = null;
      } catch (error) {
        if (!axios.isCancel(error)) {
          self.data = null;
          const fallback = _.get(error, 'message', 'unkown error');
          self.error = _.get(error, 'response.data.detail.message', fallback) as unknown as QueryFailureError;
          self.state = 'error';
        }
      }
    }),
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => self.metricID + self.metricType, self.load, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));
