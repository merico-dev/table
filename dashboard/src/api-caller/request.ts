import { DataSourceType } from '~/model';
import { AnyObject, IDashboardConfig } from '..';
import { DefaultApiClient, IAPIClient } from '../shared';
import { Method } from 'axios';

export { FacadeApiClient, DefaultApiClient } from '../shared';
export type { IAPIClient, IAPIClientRequestOptions } from '../shared';
export type TQueryPayload = {
  type: DataSourceType;
  key: string;
  query: string;
  env?: AnyObject;
};

export interface IDashboardAPIClient extends IAPIClient {
  query: <T = $TSFixMe>(signal?: AbortSignal) => (data: TQueryPayload, options?: AnyObject) => Promise<T>;
}

export class DashboardApiClient extends DefaultApiClient implements IDashboardAPIClient {
  makeQueryENV?: (() => AnyObject) | null = null;

  query<T>(signal: AbortSignal | undefined): (data: TQueryPayload, options?: AnyObject) => Promise<T> {
    return async (data: TQueryPayload, options: AnyObject = {}) => {
      if (!data.env) {
        data.env = this.makeQueryENV?.() ?? { error: 'failed to run makeQueryENV' };
      }
      return this.getRequest<T>('POST', signal)('/query', data, options);
    };
  }
}

export class DashboardApiFacadeClient implements IDashboardAPIClient {
  constructor(public implementation: IDashboardAPIClient) {}

  query<T>(signal?: AbortSignal) {
    return this.implementation.query<T>(signal);
  }

  getRequest<T>(method: Method, signal?: AbortSignal) {
    return this.implementation.getRequest<T>(method, signal);
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
