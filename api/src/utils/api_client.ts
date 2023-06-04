import axios, { AxiosRequestConfig } from 'axios';
import { HttpParams } from '../api_models/query';
import logger from 'npmlog';

export const APIClient = {
  request(host: string) {
    return (options: HttpParams) => {
      const { method, url, headers, params, data, ...restOptions } = options;

      const conf: AxiosRequestConfig = {
        baseURL: host,
        method,
        url,
        params,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          ...headers,
        },
        ...restOptions,
      };

      if (method !== 'GET') {
        conf.data = JSON.stringify(data);
      }
      return axios(conf)
        .then((res: any) => {
          return res.data;
        })
        .catch((err: any) => {
          logger.error(JSON.stringify(err.toJSON()));
          return Promise.reject(err);
        });
    };
  },
};
