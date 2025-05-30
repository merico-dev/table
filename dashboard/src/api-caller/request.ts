import { AxiosResponse, Method } from 'axios';
import { DataSourceType, TDashboardStateValues } from '~/model';
import { AnyObject, IDashboardConfig } from '..';
import { DefaultApiClient, IAPIClient } from '../shared';

export { DefaultApiClient, FacadeApiClient } from '../shared';
export type { IAPIClient, IAPIClientRequestOptions } from '../shared';

export type TAdditionalQueryInfo = {
  content_id: string;
  query_id: string;
  params: TDashboardStateValues;
};
export type TQueryPayload = {
  type: DataSourceType;
  key: string;
  query: string;
  env?: AnyObject;
} & TAdditionalQueryInfo;

export type TQueryStructureRequest = {
  query_type: 'TABLES' | 'COLUMNS' | 'DATA' | 'INDEXES' | 'COUNT';
  type: DataSourceType.Postgresql | DataSourceType.MySQL | DataSourceType.MericoMetricSystem;
  key: string; // datasource key
  table_schema: string;
  table_name: string;
  limit?: number; // default 20
  offset?: number; // default 0
};

export type QueryMMInfoRequest = {
  key: string;
  query: string;
  env?: AnyObject;
  content_id: string;
  params: TDashboardStateValues;
};

export type MetricQuery = {
  type: 'merico_metric_system';
  key: string;
  query: string;
  env?: AnyObject;
  content_id: string;
  params: TDashboardStateValues;
};

export interface IDashboardAPIClient extends IAPIClient {
  query: <T = $TSFixMe>(signal?: AbortSignal) => (data: TQueryPayload, options?: AnyObject) => Promise<T>;
  httpDataSourceQuery: <T = $TSFixMe>(
    signal?: AbortSignal,
  ) => (data: TQueryPayload, options?: AnyObject) => Promise<AxiosResponse<T>>;
  structure: <T = $TSFixMe>(signal?: AbortSignal) => (data: TQueryStructureRequest, options?: AnyObject) => Promise<T>;
  mericoMetricInfo: <T = $TSFixMe>(
    signal?: AbortSignal,
  ) => (data: QueryMMInfoRequest, options?: AnyObject) => Promise<T>;
  mericoMetricQuery: <T = $TSFixMe>(
    signal?: AbortSignal,
  ) => (data: MetricQuery, options?: AnyObject) => Promise<AxiosResponse<T>>;
}

export class DashboardApiClient extends DefaultApiClient implements IDashboardAPIClient {
  makeQueryENV?: (() => AnyObject) | null = null;

  query<T>(signal: AbortSignal | undefined): (data: TQueryPayload, options?: AnyObject) => Promise<T> {
    return async (data: TQueryPayload, options: AnyObject = {}) => {
      if (!data.env) {
        data.env = this.makeQueryENV?.() ?? { error: 'failed to run makeQueryENV' };
      }
      return this.post<T>(signal)('/query', data, options);
    };
  }

  httpDataSourceQuery<T>(
    signal: AbortSignal | undefined,
  ): (data: TQueryPayload, options?: AnyObject) => Promise<AxiosResponse<T>> {
    return async (data: TQueryPayload, options: AnyObject = {}) => {
      if (!data.env) {
        data.env = this.makeQueryENV?.() ?? { error: 'failed to run makeQueryENV' };
      }
      return this.getRequest<AxiosResponse<T>>('POST', signal)('/query', data, options, true);
    };
  }

  structure<T>(signal?: AbortSignal): (data: TQueryStructureRequest, options?: AnyObject) => Promise<T> {
    return async (data: TQueryStructureRequest, options: AnyObject = {}) => {
      return this.post<T>(signal)('/query/structure', data, options);
    };
  }

  mericoMetricInfo<T>(signal?: AbortSignal): (data: QueryMMInfoRequest, options?: AnyObject) => Promise<T> {
    return async (data: QueryMMInfoRequest, options: AnyObject = {}) => {
      return this.post<T>(signal)('/query/merico_metric_info', data, options, true);
    };
  }

  mericoMetricQuery<T>(signal?: AbortSignal): (data: MetricQuery, options?: AnyObject) => Promise<AxiosResponse<T>> {
    return async (data: MetricQuery, options: AnyObject = {}) => {
      return this.post<AxiosResponse<T>>(signal)('/query', data, options, true);
    };
  }
}

export class DashboardApiFacadeClient implements IDashboardAPIClient {
  constructor(public implementation: IDashboardAPIClient) {}

  query<T>(signal?: AbortSignal) {
    return this.implementation.query<T>(signal);
  }

  httpDataSourceQuery<T>(signal?: AbortSignal) {
    return this.implementation.httpDataSourceQuery<T>(signal);
  }

  structure(signal?: AbortSignal) {
    return this.implementation.structure(signal);
  }

  mericoMetricInfo(signal?: AbortSignal) {
    return this.implementation.mericoMetricInfo(signal);
  }
  mericoMetricQuery(signal?: AbortSignal) {
    return this.implementation.mericoMetricQuery(signal);
  }

  getRequest<T>(method: Method, signal?: AbortSignal) {
    return this.implementation.getRequest<T>(method, signal);
  }

  get<T>(signal?: AbortSignal) {
    return this.getRequest<T>('GET', signal);
  }
  post<T>(signal?: AbortSignal) {
    return this.getRequest<T>('POST', signal);
  }
  put<T>(signal?: AbortSignal) {
    return this.getRequest<T>('PUT', signal);
  }
}

const Default = new DashboardApiClient();

export function configureAPIClient(config: IDashboardConfig) {
  if (Default.baseURL !== config.apiBaseURL) {
    Default.baseURL = config.apiBaseURL;
  }
  if (config.app_id) {
    Default.app_id = config.app_id;
  }
  if (config.app_secret) {
    Default.app_secret = config.app_secret;
  }

  if (config.makeQueryENV) {
    Default.makeQueryENV = config.makeQueryENV;
  }
}

/**
 * @example facadeApiClient.implementation = new MyAPIClient();
 */
export const facadeApiClient = new DashboardApiFacadeClient(Default);

export const APIClient: IDashboardAPIClient = facadeApiClient;
