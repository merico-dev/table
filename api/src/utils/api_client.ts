import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { HttpParams } from '../api_models/query';
import log, { LOG_LABELS, LOG_LEVELS } from './logger';

export const APIClient = {
  request(host: string) {
    return (options: HttpParams, errorMessageGetter?: (err: AxiosError) => string) => {
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
          if (errorMessageGetter) {
            return Promise.reject(new Error(errorMessageGetter(err)));
          }
          log(LOG_LEVELS.ERROR, LOG_LABELS.AXIOS, JSON.stringify(err.toJSON()));
          return Promise.reject(err);
        });
    };
  },
};
