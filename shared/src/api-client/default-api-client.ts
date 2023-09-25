import { AnyObject, IAPIClient, IAPIClientRequestOptions } from './types';
import { cryptSign } from './utils';
import axios, { Method, AxiosRequestConfig } from 'axios';

export class DefaultApiClient implements IAPIClient {
  baseURL: string;
  app_id: string;
  app_secret: string;
  type = 'default_api_client';

  constructor() {
    this.baseURL = 'http://localhost:31200';
    this.app_id = '';
    this.app_secret = '';
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

  getRequest<T>(method: Method, signal?: AbortSignal) {
    return (url: string, data: AnyObject, options: IAPIClientRequestOptions = {}) => {
      const headers = this.buildHeader(options);
      const conf = this.buildAxiosConfig(method, url, data, options, headers, signal);

      return axios(conf)
        .then((res) => {
          return res.data;
        })
        .catch((err: Error) => {
          return Promise.reject(err);
        }) as Promise<T>;
    };
  }

  buildAxiosConfig(
    method: Method,
    url: string,
    data: AnyObject,
    options: IAPIClientRequestOptions,
    headers: AnyObject,
    signal: AbortSignal | undefined,
  ) {
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
    return conf;
  }

  buildHeader(options: IAPIClientRequestOptions): AnyObject {
    const token = window.localStorage.getItem('token');
    return {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': options.string ? 'application/x-www-form-urlencoded' : 'application/json',
      authorization: token ? `bearer ${token}` : '',
      ...options.headers,
    };
  }
}
