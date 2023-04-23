import { types } from 'mobx-state-tree';
import { AccessPermissionType } from '../../../../../api-caller/dashboard-permission.types';

const isAccessIDValid = (v: string) => !v.startsWith('TEMP_');

export const PermissionAccessModel = types
  .model({
    id: types.string,
    name: types.optional(types.string, ''),
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
    get valid() {
      return isAccessIDValid(self.id);
    },
  }))
  .actions((self) => ({
    setID(v: string) {
      self.id = v;
    },
    setPermission(v: AccessPermissionType) {
      self.permission = v;
    },
  }));
