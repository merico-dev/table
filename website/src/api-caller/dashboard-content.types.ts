import { AnyObject } from '@devtable/dashboard';
import { PaginationResponse } from './types';

export type DashboardContentDBType = {
  id: string;
  dashboard_id: string;
  name: string;
  content: AnyObject | null;
  create_time: string;
  update_time: string;
};

export type ListDashboardContentReqType = {
  dashboard_id: string;
  filter: {
    name: { value: string; isFuzzy: true };
  };
  pagination: {
    page: number;
    pagesize: number;
  };
};

export type ListDashboardContentRespType = PaginationResponse<DashboardContentDBType>;

export type UpdateDashboardOwnerPayloadType = {
  id: string;
  owner_id: string;
  owner_type: 'ACCOUNT' | 'APIKEY';
};

export type CreateContentPayloadType = {
  dashboard_id: string;
  name: string;
  content: AnyObject;
};

export type UpdateContentPayloadType = {
  id: string;
  name: string;
  content: AnyObject;
};

export type DeleteContentPayloadType = {
  id: string;
};
