import axios, { AxiosRequestConfig } from 'axios';
import { HttpParams } from '../api_models/query';

export const APIClient = {
  request(host: string) {
    return (options: HttpParams) => {
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const conf: AxiosRequestConfig = {
        baseURL: host,
        method: options.method,
        url: options.url,
        params: options.params,
        headers: headers,
      };

      if (options.method !== 'GET') {
        conf.data = JSON.stringify(options.data);
      }
      return axios(conf)
        .then((res: any) => {
          return res.data;
        })
        .catch((err: any) => {
          return Promise.reject(err);
        });
    };
  },
};
