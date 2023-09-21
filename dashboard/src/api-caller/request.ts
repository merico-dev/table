import axios, { AxiosRequestConfig, Method } from 'axios';
import { DataSourceType } from '~/model';
import { AnyObject } from '..';
import { cryptSign } from './utils';

type TQueryPayload = {
  type: DataSourceType;
  key: string;
  query: string;
  env?: AnyObject;
};

export interface IAPIClientRequestOptions {
  string?: boolean;
  params?: AnyObject;
  headers?: AnyObject;
}

export interface IAPIClient {
  getRequest: <T = $TSFixMe>(
    method: Method,
    signal?: AbortSignal,
  ) => (url: string, data: AnyObject, options?: IAPIClientRequestOptions) => Promise<T>;
  query: <T = $TSFixMe>(signal?: AbortSignal) => (data: TQueryPayload, options?: AnyObject) => Promise<T>;
}

export class DefaultApiClient implements IAPIClient {
  baseURL: string;
  app_id: string;
  app_secret: string;
  makeQueryENV: (() => AnyObject) | null;

  constructor() {
    this.baseURL = 'http://localhost:31200';
    this.app_id = '';
    this.app_secret = '';
    this.makeQueryENV = null;
  }

  getAuthentication(params: Record<string, unknown>) {
    if (!this.app_id || !this.app_secret) {
      return undefined;
    }
    const nonce_str = new Date().getTime().toString();
    return {
      app_id: this.app_id,
      nonce_str,
      sign: cryptSign(
        {
          app_id: this.app_id,
          nonce_str,
          ...params,
        },
        this.app_secret,
      ),
    };
  }

  getRequest(method: Method, signal?: AbortSignal) {
    return (url: string, data: AnyObject, options: IAPIClientRequestOptions = {}) => {
      const token = window.localStorage.getItem('token');
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': options.string ? 'application/x-www-form-urlencoded' : 'application/json',
        authorization: token ? `bearer ${token}` : '',
        ...options.headers,
      };

      const conf: AxiosRequestConfig = {
        baseURL: this.baseURL,
        method,
        url,
        params: method === 'GET' ? data : options.params,
        headers,
        signal,
      };

      if (['POST', 'PUT'].includes(method)) {
        conf.data = options.string ? JSON.stringify(data) : data;
        conf.data.authentication = this.getAuthentication(conf.data);
      }

      return axios(conf)
        .then((res) => {
          return res.data;
        })
        .catch((err: Error) => {
          return Promise.reject(err);
        });
    };
  }

  query(signal?: AbortSignal) {
    return async (data: TQueryPayload, options: AnyObject = {}) => {
      if (!data.env) {
        data.env = this.makeQueryENV?.() ?? { error: 'failed to run makeQueryENV' };
      }
      return this.getRequest('POST', signal)('/query', data, options);
    };
  }
}

const Default = new DefaultApiClient();

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

class FacadeApiClient implements IAPIClient {
  implementation: IAPIClient = Default;

  getRequest<T>(
    method: Method,
    signal: AbortSignal | undefined,
  ): (url: string, data: AnyObject, options?: IAPIClientRequestOptions) => Promise<T> {
    return this.implementation.getRequest(method, signal);
  }

  query<T>(signal: AbortSignal | undefined): (data: TQueryPayload, options?: AnyObject) => Promise<T> {
    return this.implementation.query(signal);
  }
}

export const facadeApiClient = new FacadeApiClient();

export const APIClient: IAPIClient = facadeApiClient;
