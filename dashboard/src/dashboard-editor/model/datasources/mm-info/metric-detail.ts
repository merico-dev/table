import axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, getParent, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { DataSourceType } from '~/model';
import { postProcessWithDataSource, preProcessWithDataSource } from '~/utils';

export type DerivedMetricCol = {
  id: string;
  type: 'filter' | 'group_by' | 'default_filter' | 'trending_date_col';
  defaultFilterComparison: any | null;
  dimensionFieldId: string | null;
};
export type DerivedMetric = {
  id: string;
  name: string;
  description: string;
  cols: DerivedMetricCol[];
};
export type CombinedMetric = {
  id: string;
  name: string;
  description: string;
  derivedMetrics: DerivedMetric[];
  supportTrending: boolean;
};

export type MetricDetail = DerivedMetric | CombinedMetric;

function getURLByType(type: 'derived' | 'combined', id: string) {
  if (!id) {
    throw new Error(`Shouldnt run query without ID`);
  }

  if (type === 'derived') {
    return `/buffet/api/metric_management/derived_metric/${id}`;
  }
  if (type === 'combined') {
    return `/buffet/api/metric_management/combined_metric/${id}`;
  }
  throw new Error(`Unexpected metric type[${type}]`);
}

export const MetricDetailModel = types
  .model({
    data: types.optional(types.frozen<MetricDetail[]>(), []),
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
    get empty() {
      return Object.keys(self.data).length === 0;
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
  }))
  .actions((self) => ({
    load: flow(function* () {
      if (self.mmInfo.type !== DataSourceType.MericoMetricSystem) {
        return;
      }
      if (!self.metricID) {
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
          APIClient.mericoMetricInfo<AxiosResponse<MetricDetail[]>>(self.controller.signal)(
            {
              key: self.mmInfo.key,
              query: JSON.stringify(config),
              ...self.mmInfo.additionalQueryInfo,
            },
            self.controller.signal,
          ),
        );
        const result = postProcessWithDataSource(self.mmInfo.dataSource, response);
        const data = result.data;
        self.data = data;
        self.state = 'idle';
        self.error = null;
      } catch (error) {
        if (!axios.isCancel(error)) {
          self.data.length = 0;
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
        reaction(() => self.metricID, self.load, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));
