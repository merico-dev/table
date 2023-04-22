import { types } from 'mobx-state-tree';
import { AccessPermissionType } from '../../../../../api-caller/dashboard-permission.types';

export const PermissionAccessModel = types
  .model({
    id: types.identifier,
    type: types.enumeration(['ACCOUNT', 'APIKEY']),
    permission: types.enumeration(['VIEW', 'EDIT', 'REMOVE']),
  })
  .views((self) => ({
    get json() {
      const { id, type, permission } = self;
      return {
        id,
        type,
        permission,
      };
    },
  }))
  .actions((self) => ({
    setPermission(v: AccessPermissionType) {
      self.permission = v;
    },
  }));
