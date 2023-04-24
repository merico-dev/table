import { PaginationResponse } from './types';

export type DashboardOwnerType = 'ACCOUNT' | 'APIKEY' | null;
export type AccessType = 'ACCOUNT' | 'APIKEY';
export type AccessPermissionType = 'VIEW' | 'EDIT' | 'REMOVE'; // REMOVE means to remove on permission's next update

export const AccessPermissionLabelMap = {
  VIEW: 'view',
  EDIT: 'view, edit',
  REMOVE: 'reset to default access',
};
export const AccessPermissionOptions = [
  { label: AccessPermissionLabelMap.VIEW, value: 'VIEW' },
  { label: AccessPermissionLabelMap.EDIT, value: 'EDIT' },
  { label: AccessPermissionLabelMap.REMOVE, value: 'REMOVE' },
];

export type AccountOrAPIKeyOptionType = {
  label: string;
  value: string;
  type: 'ACCOUNT' | 'APIKEY';
};

export type PermissionResourceType = {
  id: string;
  name?: string;
  type: AccessType;
  permission: AccessPermissionType;
};

export type DashboardPermissionDBType = {
  id: string;
  owner_id: string;
  owner_name: string;
  owner_type: DashboardOwnerType;
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
