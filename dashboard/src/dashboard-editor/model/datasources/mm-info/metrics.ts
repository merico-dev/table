import axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, getParent, getRoot, toGenerator, types } from 'mobx-state-tree';
import { QueryFailureError } from '~/api-caller';
import { APIClient, TAdditionalQueryInfo } from '~/api-caller/request';
import { DataSourceType } from '~/model';
import { postProcessWithDataSource, preProcessWithDataSource } from '~/utils';

export type MetricBriefInfo = {
  id: string;
  name: string;
  description: string;
  type: 'derived' | 'combined';
};

export const MetricsModel = types
  .model({
    keyword: types.optional(types.string, ''),
    data: types.optional(types.frozen<MetricBriefInfo[]>(), []),
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
    get rootModel(): any {
      return getRoot(self);
    },
    get contentModel(): any {
      return this.rootModel.content; // dashboard content model
    },
    get additionalQueryInfo(): TAdditionalQueryInfo {
      return this.contentModel.getAdditionalQueryInfo('');
    },
    get dataSource() {
      return getParent(self, 2) as any;
    },
    get key() {
      return this.dataSource.key;
    },
    get type() {
      return this.dataSource.type;
    },
  }))
  .actions((self) => ({
    setKeyword(v: string) {
      self.keyword = v;
    },
  }))
  .actions((self) => ({
    load: flow(function* () {
      if (self.type !== DataSourceType.MericoMetricSystem) {
        return;
      }

      self.controller?.abort();
      self.controller = new AbortController();
      self.state = 'loading';
      try {
        const config = preProcessWithDataSource(self.dataSource, {
          url: '/buffet/api/metric_management/search',
          method: 'POST',
          data: {
            key: self.key,
          },
          params: { search: self.keyword },
        });
        const response = yield* toGenerator(
          APIClient.mericoMetricInfo<AxiosResponse<MetricBriefInfo[]>>(self.controller.signal)(
            {
              key: self.key,
              query: JSON.stringify(config),
              ...self.additionalQueryInfo,
            },
            self.controller.signal,
          ),
        );
        const result = postProcessWithDataSource(self.dataSource, response);
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
      console.log('🔴afterCreate');
      addDisposer(
        self,
        reaction(() => `${self.type}:${self.keyword}`, self.load, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));
