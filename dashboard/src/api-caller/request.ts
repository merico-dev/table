import axios, { Method } from 'axios';
import { DataSourceType } from '~/model/queries/types';
import { AnyObject } from '..';
import { cryptSign } from './utils';

type TQueryPayload = {
  type: DataSourceType;
  key: string;
  query: string;
  content_id: string;
  query_id: string;
  env?: AnyObject;
};

export const APIClient = {
  baseURL: 'http://localhost:31200',
  app_id: '',
  app_secret: '',
  getAuthentication(params: Record<string, $TSFixMe>) {
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
  },
  getRequest(method: Method, signal?: AbortSignal) {
    return (url: string, data: $TSFixMe, options: $TSFixMe = {}) => {
      const token = window.localStorage.getItem('token');
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': options.string ? 'application/x-www-form-urlencoded' : 'application/json',
        authorization: token ? `bearer ${token}` : '',
        ...options.headers,
      };

      const conf: $TSFixMe = {
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
        .then((res: $TSFixMe) => {
          return res.data;
        })
        .catch((err: $TSFixMe) => {
          return Promise.reject(err);
        });
    };
  },
  makeQueryENV: null as null | (() => AnyObject),
  query(signal?: AbortSignal) {
    return async (data: TQueryPayload, options: AnyObject = {}) => {
      if (!data.env) {
        data.env = this.makeQueryENV?.() ?? { error: 'failed to run makeQueryENV' };
      }
      return this.getRequest('POST', signal)('/query', data, options);
    };
  },
};

export function configureAPIClient(config: IDashboardConfig) {
  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }
  if (config.app_id) {
    APIClient.app_id = config.app_id;
  }
  if (config.app_secret) {
    APIClient.app_secret = config.app_secret;
  }
  if (config.makeQueryENV) {
    APIClient.makeQueryENV = config.makeQueryENV;
  }
}
