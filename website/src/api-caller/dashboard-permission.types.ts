import { PaginationResponse } from './types';

export type AccessType = 'ACCOUNT' | 'APIKEY';
export type AccessPermissionType = 'VIEW' | 'EDIT' | 'REMOVE';

export const AccessPermissionOptions = [
  { label: 'View', value: 'VIEW' },
  { label: 'Edit', value: 'EDIT' },
  // { label: 'Remove', value: 'REMOVE', disabled: true },
];
export const AccessPermissionLabelMap = {
  VIEW: 'View',
  EDIT: 'Edit',
  REMOVE: 'Remove',
};

export type AccountOrAPIKeyOptionType = {
  label: string;
  value: string;
  type: 'ACCOUNT' | 'APIKEY';
};

export type PermissionResourceType = {
  type: AccessType;
  id: string;
  permission: AccessPermissionType;
};

export type DashboardPermissionDBType = {
  id: string;
  owner_id: string;
  owner_type: 'APIKEY' | 'ACCOUNT' | null;
  access: PermissionResourceType[];
  create_time: string;
  update_time: string;
};

export type ListDashboardPermissionReqType = {
  filter: {
    id: { value: string; isFuzzy: false };
  };
  pagination: {
    page: number;
    pagesize: number;
  };
};

export type ListDashboardPermissionRespType = PaginationResponse<DashboardPermissionDBType>;

export type UpdateDashboardOwnerPayloadType = {
  id: string;
  owner_id: string;
  owner_type: 'ACCOUNT' | 'APIKEY';
};

export type UpdatePermissionPayloadType = {
  id: string;
  access: PermissionResourceType[];
};
