import axios from 'axios';
import { get } from 'lodash';
import { reaction } from 'mobx';
import { addDisposer, cast, flow, Instance, SnapshotIn, toGenerator, types } from 'mobx-state-tree';
import { DashboardPermissionAPI } from '../../../../../api-caller/dashboard-permission';
import { DashboardPermissionDBType } from '../../../../../api-caller/dashboard-permission.types';
import { PermissionAccessModel } from './permission-access-model';

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
    access: types.array(PermissionAccessModel),
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
    get json() {
      const { id, owner_id, owner_type, create_time, update_time, access } = self;
      return {
        id,
        access: access.map((item) => item.json),
        owner_id,
        owner_type,
        create_time,
        update_time,
      };
    },
    get usageRestricted() {
      return self.access.some((d) => d.permission === 'VIEW');
    },
    get editingRestricted() {
      return self.access.some((d) => d.permission === 'EDIT');
    },
    get removalRestricted() {
      return self.access.some((d) => d.permission === 'REMOVE');
    },
    get controlled() {
      return self.access.length > 0 && self.access.some((d) => !d.id.startsWith('TEMP_'));
    },
  }))
  .volatile(() => ({
    controller: new AbortController(),
  }))
  .actions((self) => ({
    addAnAccess() {
      self.access.push({
        id: `TEMP_${new Date().getTime()}`,
        type: 'ACCOUNT',
        permission: 'VIEW',
      });
    },
    setData(data: DashboardPermissionDBType) {
      const { id, owner_id, owner_type, create_time, update_time, access } = data;
      self.id = id;
      self.owner_id = owner_id;
      self.owner_type = owner_type ? owner_type : null;
      self.create_time = create_time;
      self.update_time = update_time;
      self.access = cast(access);
    },
  }))
  .actions((self) => {
    return {
      load: flow(function* () {
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
  return PermissionModel.create({ dashboard_id, access: [] });
};
