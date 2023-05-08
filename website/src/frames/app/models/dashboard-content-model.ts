import { AnyObject } from '@devtable/dashboard';
import axios from 'axios';
import _ from 'lodash';
import { autorun, reaction } from 'mobx';
import { addDisposer, flow, Instance, toGenerator, types } from 'mobx-state-tree';
import { APICaller } from '../../../api-caller';

export const DashboardContentModel = types
  .model({
    id: types.maybeNull(types.string),
    data: types.frozen<AnyObject>(),
    state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
    error: types.frozen(),
  })
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .actions((self) => ({
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
        if (!data) {
          throw new Error('Dashboard content is not found');
        }
        self.data = data;
        self.state = 'idle';
        self.error = null;
      } catch (error) {
        if (!axios.isCancel(error)) {
          self.data = {};
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
