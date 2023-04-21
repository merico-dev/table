import { PaginationResponse } from './types';

export type PermissionResourceType = {
  type: 'ACCOUNT' | 'APIKEY';
  id: string;
  permission: 'VIEW' | 'EDIT' | 'REMOVE';
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
