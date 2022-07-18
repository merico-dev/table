import { 
  Dashboard, DashboardFilterObject, DashboardSortObject, DashboardListRequest, DashboardPaginationResponse, 
  DashboardCreateRequest, DashboardUpdateRequest, DashboardIDRequest,
} from './dashboard';
import {
  DataSourceConfig, DataSource, DataSourceFilterObject, DataSourceSortObject, DataSourceListRequest,
  DataSourcePaginationResponse, DataSourceCreateRequest, DataSourceIDRequest,
} from './datasource';
import { QueryRequest } from './query';
import { ApiError } from './base';

export default {
  ApiError,
  
  Dashboard,
  DashboardFilterObject,
  DashboardSortObject,
  DashboardListRequest,
  DashboardPaginationResponse,
  DashboardCreateRequest,
  DashboardUpdateRequest,
  DashboardIDRequest,

  DataSourceConfig,
  DataSource, 
  DataSourceFilterObject, 
  DataSourceSortObject, 
  DataSourceListRequest,
  DataSourcePaginationResponse, 
  DataSourceCreateRequest, 
  DataSourceIDRequest,

  QueryRequest,
}