import axios from 'axios';
import { get } from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, flow, Instance, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
import { DashboardPermissionAPI } from '../../../../api-caller/dashboard-permission';
import { DashboardPermissionDBType, PermissionResourceType } from '../../../../api-caller/dashboard-permission.types';

const defaultData: DashboardPermissionDBType = {
  id: '',
  owner_id: '',
  owner_type: 'ACCOUNT',
  create_time: '',
  update_time: '',
  access: [],
};

export const PermissionModel = types
  .model({
    dashboard_id: types.identifier,
    id: types.optional(types.string, ''),
    owner_id: types.maybeNull(types.string),
    owner_type: types.maybeNull(types.enumeration(['ACCOUNT', 'APIKEY'])),
    create_time: types.optional(types.string, ''),
    update_time: types.optional(types.string, ''),
    access: types.optional(types.frozen<PermissionResourceType[]>(), []),
    state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
    error: types.frozen(),
  })
  .views((self) => ({
    get loading() {
      return self.state === 'loading';
    },
    get loaded() {
      return !!self.id;
    },
    get empty() {
      return self.access.length === 0;
    },
  }))
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .actions((self) => ({
    setData(data: DashboardPermissionDBType) {
      const { id, owner_id, owner_type, create_time, update_time, access } = data;
      self.id = id;
      self.owner_id = owner_id;
      self.owner_type = owner_type ? owner_type : null;
      self.create_time = create_time;
      self.update_time = update_time;
      self.access = access;
    },
  }))
  .actions((self) => {
    return {
      load: flow(function* () {
        console.log(self.dashboard_id);
        if (!self.dashboard_id) {
          return;
        }
        self.controller?.abort();
        self.controller = new AbortController();
        self.state = 'loading';
        try {
          let data = yield* toGenerator(DashboardPermissionAPI.get(self.dashboard_id));
          if (!data) {
            data = defaultData;
          }
          self.setData(data);
          console.log('🟩 loaded', data);
          self.state = 'idle';
          self.error = null;
        } catch (error) {
          if (!axios.isCancel(error)) {
            self.setData(defaultData);
            self.error = get(error, 'message', 'unkown error');
            self.state = 'error';
          }
        }
      }),
    };
  })
  .actions((self) => ({
    beforeDestroy() {
      self.controller?.abort();
    },
    afterCreate() {
      addDisposer(
        self,
        reaction(() => self.dashboard_id, self.load, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));

export type PermissionModelInstance = Instance<typeof PermissionModel>;
export type PermissionModelSnapshotIn = SnapshotIn<PermissionModelInstance>;

export const createPermissionModel = (dashboard_id: string) => {
  console.log({ dashboard_id });
  return PermissionModel.create({ dashboard_id });
};
