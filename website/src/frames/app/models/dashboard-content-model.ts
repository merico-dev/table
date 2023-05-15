import { TDashboardContent } from '@devtable/dashboard';
import axios from 'axios';
import _ from 'lodash';
import { autorun, reaction } from 'mobx';
import { Instance, addDisposer, flow, toGenerator, types } from 'mobx-state-tree';
import { APICaller } from '../../../api-caller';
import { DashboardContentDBType } from '../../../api-caller/dashboard-content.types';

export const DashboardContentModel = types
  .model({
    id: types.maybeNull(types.string),
    data: types.frozen<TDashboardContent | null>(),
    fullData: types.frozen<DashboardContentDBType | null>(null),
    state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
    error: types.frozen(),
  })
  .views((self) => ({
    get loaded() {
      return self.state === 'idle' && self.data !== null && Object.keys(self.data).length > 0;
    },
    get loading() {
      return self.state === 'loading';
    },
  }))
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .actions((self) => ({
    setName(name: string) {
      if (!self.fullData) {
        throw new Error('Dashboard content is not loaded');
      }
      self.fullData = {
        ...self.fullData,
        name,
      };
    },
    setID(id: string) {
      self.id = id;
    },
    load: flow(function* () {
      if (!self.id) {
        return;
      }

      self.controller?.abort();
      self.controller = new AbortController();
      self.state = 'loading';
      try {
        const data = yield* toGenerator(APICaller.dashboard_content.details(self.id, self.controller.signal));
        if (!data || !data.content) {
          throw new Error('Dashboard content is not found');
        }
        self.data = data.content;
        self.fullData = data;
        self.state = 'idle';
        self.error = null;
      } catch (error) {
        if (!axios.isCancel(error)) {
          self.data = null;
          self.fullData = null;
          const fallback = _.get(error, 'message', 'unkown error');
          self.error = _.get(error, 'response.data.detail.message', fallback) as unknown as string;
          self.state = 'error';
        }
      }
    }),
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(self, autorun(self.load));
      addDisposer(
        self,
        reaction(() => self.id, self.load),
      );
    },
  }));

export type DashboardContentModelInstance = Instance<typeof DashboardContentModel>;
