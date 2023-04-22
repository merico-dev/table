import { types } from 'mobx-state-tree';
import { AccessPermissionType } from '../../../../../api-caller/dashboard-permission.types';

export const PermissionAccessModel = types
  .model({
    id: types.identifier,
    type: types.enumeration(['ACCOUNT', 'APIKEY']),
    permission: types.enumeration(['VIEW', 'EDIT', 'REMOVE']),
  })
  .actions((self) => ({
    setPermission(v: AccessPermissionType) {
      self.permission = v;
    },
  }));
