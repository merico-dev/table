import { Instance, types } from 'mobx-state-tree';
import { PermissionAccessModel } from '../../../pages/dashboard-editor-page/more-dashboard-info/dashboard-permission-modal/model/permission-access-model';
import { IAccount } from '@devtable/settings-form';

export const DashboardBriefModel = types
  .model('DashboardBriefModel', {
    id: types.identifier,
    name: types.string,
    group: types.string,
    is_preset: types.maybe(types.boolean),
    owner_id: types.maybeNull(types.string),
    owner_type: types.maybeNull(types.enumeration(['ACCOUNT', 'APIKEY'])),
    content_id: types.maybeNull(types.string),
    access: types.array(PermissionAccessModel),
    // for simplicity, use string for the date time type for now
    create_time: types.string,
    update_time: types.string,
    is_removed: types.boolean,
  })
  .views((self) => ({
    get isEditable() {
      return !self.is_preset;
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
    canEdit(account: IAccount) {
      if (!this.isEditable) {
        return false;
      }
      if (['INACTIVE', 'READER'].includes(account.role_id)) {
        return false;
      }
      if (self.owner_id === account.id) {
        return true;
      }
      if (!this.editingRestricted) {
        return true;
      }
      return self.access.some((d) => d.id === account.id && d.permission === 'EDIT');
    },
  }));

export type DashboardBriefModelInstance = Instance<typeof DashboardBriefModel>;
