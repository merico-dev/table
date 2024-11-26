import axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, getParent, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient } from '~/api-caller/request';
import { DataSourceType } from '~/model';
import { postProcessWithDataSource, preProcessWithDataSource } from '~/utils';
import { DimensionCol, DimensionColDataType, MetricDetail } from './metric-detail.types';

const dimensionColDataTypeNames: Record<DimensionColDataType | 'dimension', string> = {
  string: '维度列',
  number: '数值列',
  date: '数值列',
  boolean: '维度列',
  dimension: '扩展维度',
};

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
    data: types.optional(types.frozen<MetricDetail | null>(), null),
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
    get cols() {
      if (self.data === null) {
        return [];
      }
      return self.data.cols;
    },
    colOptions(type: DimensionCol['type'] | null) {
      let cols = this.cols;
      console.log({ cols });
      if (type) {
        cols = cols.filter((c) => c.type === type);
      }
      const grouped = _.groupBy(cols, (c) => {
        const { colType, dataType } = c.metricSourceCol;
        if (dataType) {
          return dimensionColDataTypeNames[dataType];
        } else if (colType === 'dimension') {
          return dimensionColDataTypeNames.dimension;
        }
        return 'ERROR';
      });
      const ret = Object.entries(grouped).map(([k, items]) => ({
        group: `${k}(${items.length})`,
        items: items.map((item) => {
          const col = item.metricSourceCol;
          if (col.colType !== 'dimension') {
            return {
              label: col.name,
              value: item.id,
              ...col,
            };
          }
          return {
            group: col.name,
            description: col.description,
            items: col.dimension?.fields.map((f) => ({
              label: f.field,
              value: f.id,
              ...f,
            })),
          };
        }),
      }));
      return ret;
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
        console.log({ data });
        self.data = data;
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
        reaction(() => self.metricID, self.load, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));
